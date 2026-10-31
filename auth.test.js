import test from 'node:test';
import assert from 'node:assert/strict';
import { createAuthClient, SESSION_KEY } from '../src/auth/client.js';
import { validateEmail, validatePassword } from '../src/auth/validate.js';

const URL = 'https://demo.supabase.co';
const KEY = 'anon-key';

function memoryStorage(initial = {}) {
  const m = new Map(Object.entries(initial));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k),
    dump: () => Object.fromEntries(m),
  };
}

// fetch tiruan: antrean respons; calls menyimpan semua permintaan.
function fakeFetch(...responses) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    const next = responses.shift();
    if (next instanceof Error) throw next;
    return { ok: next.status < 400, status: next.status, json: async () => next.body };
  };
  impl.calls = calls;
  return impl;
}

const tokenBody = (extra = {}) => ({
  access_token: 'AT',
  refresh_token: 'RT',
  expires_in: 3600,
  user: { id: 'u1', email: 'a@b.id' },
  ...extra,
});

const NOW = 1_800_000_000_000;
const make = (fetchImpl, storage = memoryStorage()) =>
  createAuthClient({ url: URL, anonKey: KEY, storage, fetchImpl, now: () => NOW });

const stored = (expiresAt) =>
  JSON.stringify({ accessToken: 'OLD', refreshToken: 'ORT', expiresAt, user: { id: 'u1', email: 'a@b.id' } });

test('signIn sukses: kirim ke endpoint password grant dengan apikey, simpan sesi', async () => {
  const f = fakeFetch({ status: 200, body: tokenBody() });
  const storage = memoryStorage();
  const res = await make(f, storage).signIn('  A@B.id ', 'rahasia123');
  assert.equal(res.ok, true);
  assert.equal(res.session.user.email, 'a@b.id');
  assert.equal(f.calls[0].url, `${URL}/auth/v1/token?grant_type=password`);
  assert.equal(f.calls[0].init.headers.apikey, KEY);
  assert.deepEqual(JSON.parse(f.calls[0].init.body), { email: 'a@b.id', password: 'rahasia123' });
  assert.ok(storage.getItem(SESSION_KEY));
});

test('kata sandi tidak pernah tersimpan di penyimpanan', async () => {
  const storage = memoryStorage();
  await make(fakeFetch({ status: 200, body: tokenBody() }), storage).signIn('a@b.id', 'rahasia123');
  assert.equal(JSON.stringify(storage.dump()).includes('rahasia123'), false);
});

test('signIn gagal: pesan Indonesia dan tidak ada sesi tersimpan', async () => {
  const storage = memoryStorage();
  const f = fakeFetch({ status: 400, body: { error_code: 'invalid_credentials', msg: 'Invalid login credentials' } });
  const res = await make(f, storage).signIn('a@b.id', 'salah');
  assert.equal(res.ok, false);
  assert.equal(res.error, 'Email atau kata sandi salah.');
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test('signIn saat jaringan putus memberi pesan koneksi', async () => {
  const res = await make(fakeFetch(new Error('offline'))).signIn('a@b.id', 'x12345678');
  assert.equal(res.ok, false);
  assert.match(res.error, /koneksi internet/);
});

test('signUp dengan konfirmasi email: needsConfirmation, tanpa sesi', async () => {
  const storage = memoryStorage();
  const f = fakeFetch({ status: 200, body: { id: 'u2', email: 'c@d.id' } });
  const res = await make(f, storage).signUp('c@d.id', 'rahasia123');
  assert.equal(res.ok, true);
  assert.equal(res.needsConfirmation, true);
  assert.equal(storage.getItem(SESSION_KEY), null);
  assert.equal(f.calls[0].url, `${URL}/auth/v1/signup`);
});

test('signUp email sudah terdaftar', async () => {
  const f = fakeFetch({ status: 422, body: { error_code: 'user_already_exists' } });
  const res = await make(f).signUp('c@d.id', 'rahasia123');
  assert.equal(res.error, 'Email ini sudah terdaftar. Silakan masuk.');
});

test('restore tanpa sesi: signed-out tanpa request', async () => {
  const f = fakeFetch();
  assert.deepEqual(await make(f).restore(), { state: 'signed-out' });
  assert.equal(f.calls.length, 0);
});

test('restore sesi masih berlaku: signed-in tanpa request', async () => {
  const f = fakeFetch();
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW + 10 * 60_000) });
  const r = await make(f, storage).restore();
  assert.equal(r.state, 'signed-in');
  assert.equal(f.calls.length, 0);
});

test('restore token kedaluwarsa: refresh berhasil menyimpan token baru', async () => {
  const f = fakeFetch({ status: 200, body: tokenBody({ access_token: 'NEW', refresh_token: 'NRT' }) });
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW - 1000) });
  const r = await make(f, storage).restore();
  assert.equal(r.state, 'signed-in');
  assert.equal(r.session.accessToken, 'NEW');
  assert.equal(JSON.parse(storage.getItem(SESSION_KEY)).refreshToken, 'NRT');
  assert.equal(f.calls[0].url, `${URL}/auth/v1/token?grant_type=refresh_token`);
});

test('restore token kedaluwarsa: refresh ditolak server menghapus sesi', async () => {
  const f = fakeFetch({ status: 400, body: { error_code: 'refresh_token_not_found' } });
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW - 1000) });
  assert.deepEqual(await make(f, storage).restore(), { state: 'signed-out' });
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test('restore offline dengan sesi yang pernah valid: tetap masuk (stale), sesi dipertahankan', async () => {
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW - 1000) });
  const r = await make(fakeFetch(new Error('offline')), storage).restore();
  assert.equal(r.state, 'signed-in');
  assert.equal(r.stale, true);
  assert.ok(storage.getItem(SESSION_KEY));
});

test('restore mengabaikan data sesi rusak', async () => {
  const storage = memoryStorage({ [SESSION_KEY]: '{"bukan":"sesi"}' });
  assert.deepEqual(await make(fakeFetch(), storage).restore(), { state: 'signed-out' });
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test('signOut hanya menghapus sesi; data keuangan lokal tetap ada', async () => {
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW + 600_000), 'pft.data': 'catatan-keuangan' });
  const f = fakeFetch({ status: 204, body: {} });
  await make(f, storage).signOut();
  assert.equal(storage.getItem(SESSION_KEY), null);
  assert.equal(storage.getItem('pft.data'), 'catatan-keuangan');
  assert.equal(f.calls[0].url, `${URL}/auth/v1/logout?scope=local`);
  assert.equal(f.calls[0].init.headers.Authorization, 'Bearer OLD');
});

test('signOut tetap menghapus sesi walau request gagal', async () => {
  const storage = memoryStorage({ [SESSION_KEY]: stored(NOW + 600_000) });
  await make(fakeFetch(new Error('offline')), storage).signOut();
  assert.equal(storage.getItem(SESSION_KEY), null);
});

test('klien tanpa konfigurasi menolak login dengan pesan jelas', async () => {
  const c = createAuthClient({ url: '', anonKey: '', storage: memoryStorage(), fetchImpl: fakeFetch() });
  assert.equal(c.configured, false);
  const res = await c.signIn('a@b.id', 'rahasia123');
  assert.equal(res.ok, false);
  assert.match(res.error, /belum dikonfigurasi/);
});

test('validasi email dan kata sandi', () => {
  assert.equal(validateEmail('a@b.id'), null);
  assert.ok(validateEmail('abc'));
  assert.ok(validateEmail(''));
  assert.equal(validatePassword('12345678'), null);
  assert.ok(validatePassword('1234567'));
  assert.ok(validatePassword(''));
});
