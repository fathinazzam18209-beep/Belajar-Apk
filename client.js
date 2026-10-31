// Klien Supabase Auth via REST (GoTrue). HANYA autentikasi.
// Tidak ada transaksi/saldo yang pernah dikirim lewat modul ini.
// Kata sandi dikirim ke Supabase saat login/daftar dan tidak pernah disimpan.
import { mapAuthError, NOT_CONFIGURED } from './errors.js';
import { normalizeEmail } from './validate.js';

export const SESSION_KEY = 'pft.session';
const SKEW_MS = 60_000; // anggap token kedaluwarsa 1 menit lebih awal

export function createAuthClient({ url, anonKey, storage, fetchImpl, now = Date.now }) {
  const base = String(url || '').replace(/\/+$/, '');
  const configured = Boolean(base && anonKey);
  const doFetch = fetchImpl || ((...args) => fetch(...args));

  const readStored = () => {
    try {
      const raw = storage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      const ok = s && s.accessToken && s.refreshToken && Number.isFinite(s.expiresAt) && s.user && s.user.email;
      return ok ? s : null;
    } catch {
      return null;
    }
  };
  const writeStored = (s) => {
    try { storage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* penyimpanan penuh/diblokir */ }
  };
  const clearStored = () => {
    try { storage.removeItem(SESSION_KEY); } catch { /* diabaikan */ }
  };

  function toSession(d) {
    const expiresAt = d.expires_at ? d.expires_at * 1000 : now() + (d.expires_in || 3600) * 1000;
    return {
      accessToken: d.access_token,
      refreshToken: d.refresh_token,
      expiresAt,
      user: { id: d.user && d.user.id, email: d.user && d.user.email },
    };
  }

  async function request(path, body, token) {
    let res;
    try {
      res = await doFetch(base + path, {
        method: 'POST',
        headers: {
          apikey: anonKey,
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch {
      return { network: true };
    }
    let data = {};
    try { data = await res.json(); } catch { /* body kosong */ }
    return { ok: res.ok, status: res.status, data };
  }

  return {
    configured,

    async signIn(email, password) {
      if (!configured) return { ok: false, error: NOT_CONFIGURED };
      const r = await request('/auth/v1/token?grant_type=password', { email: normalizeEmail(email), password });
      if (r.network) return { ok: false, error: mapAuthError(null, true) };
      if (!r.ok || !r.data.access_token) return { ok: false, error: mapAuthError(r.data, false, r.status) };
      const session = toSession(r.data);
      writeStored(session);
      return { ok: true, session };
    },

    async signUp(email, password) {
      if (!configured) return { ok: false, error: NOT_CONFIGURED };
      const r = await request('/auth/v1/signup', { email: normalizeEmail(email), password });
      if (r.network) return { ok: false, error: mapAuthError(null, true) };
      if (!r.ok) return { ok: false, error: mapAuthError(r.data, false, r.status) };
      if (r.data.access_token) {
        const session = toSession(r.data);
        writeStored(session);
        return { ok: true, session };
      }
      // Konfirmasi email aktif: belum ada sesi sampai email dikonfirmasi.
      return { ok: true, needsConfirmation: true };
    },

    // Memulihkan sesi saat aplikasi dibuka.
    // Offline hanya diizinkan bila sesi valid pernah dibuat di perangkat ini.
    async restore() {
      const stored = readStored();
      if (!stored) {
        clearStored();
        return { state: 'signed-out' };
      }
      if (stored.expiresAt - SKEW_MS > now()) return { state: 'signed-in', session: stored };
      if (!configured) return { state: 'signed-in', session: stored, stale: true };

      const r = await request('/auth/v1/token?grant_type=refresh_token', { refresh_token: stored.refreshToken });
      if (r.network || (r.status && r.status >= 500)) {
        return { state: 'signed-in', session: stored, stale: true };
      }
      if (r.ok && r.data.access_token) {
        const session = toSession(r.data);
        writeStored(session);
        return { state: 'signed-in', session };
      }
      clearStored(); // refresh token ditolak server: sesi tidak berlaku lagi
      return { state: 'signed-out' };
    },

    // Logout hanya menghapus sesi. Data keuangan (IndexedDB) tidak disentuh.
    async signOut() {
      const stored = readStored();
      clearStored();
      if (configured && stored) {
        await request('/auth/v1/logout?scope=local', null, stored.accessToken); // best-effort
      }
      return { ok: true };
    },
  };
}
