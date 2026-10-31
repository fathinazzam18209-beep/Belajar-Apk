import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import { registerSW } from 'virtual:pwa-register';
import { icons } from './lib/icons.js';
import { createAuthClient } from './auth/client.js';
import { validateEmail, validatePassword, normalizeEmail } from './auth/validate.js';
import { renderHome } from './views/home.js';
import { renderPlaceholder } from './views/placeholder.js';
import { renderAuth } from './views/auth.js';
import { renderProfile } from './views/profile.js';

const app = document.getElementById('app');

// Autentikasi: Supabase hanya untuk login. Data keuangan tidak melewati modul ini.
const auth = createAuthClient({
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  storage: window.localStorage,
});

const state = {
  status: 'loading', // loading | signed-out | signed-in
  session: null,
  stale: false, // true = sesi tersimpan dipakai saat offline/server tidak terjangkau
  mode: 'login',
  email: '',
  error: '',
  info: '',
  busy: false,
  confirmLogout: false,
};

function setState(patch) {
  Object.assign(state, patch);
  render();
}

const ROUTES = {
  '/': () => renderHome({ name: (state.session?.user?.email || '').split('@')[0] }),
  '/akun': () => renderPlaceholder('akun'),
  '/tambah': () => renderPlaceholder('tambah'),
  '/analitik': () => renderPlaceholder('analitik'),
  '/investasi': () => renderPlaceholder('investasi'),
  '/profil': () => renderProfile({ email: state.session?.user?.email, stale: state.stale, confirming: state.confirmLogout }),
};

function navItem(href, label, icon, path) {
  const current = path === href ? ' aria-current="page"' : '';
  return `<a href="#${href}"${current}>${icon}<span>${label}</span></a>`;
}

function offlineBanner(text) {
  return navigator.onLine ? '' : `<div class="offline" role="status">${text}</div>`;
}

function render() {
  if (state.status === 'loading') {
    app.innerHTML = '<div class="splash" role="status">Memuat...</div>';
    return;
  }

  if (state.status === 'signed-out') {
    app.innerHTML =
      offlineBanner('Anda sedang offline. Masuk memerlukan internet.') +
      renderAuth({ ...state, configured: auth.configured });
    return;
  }

  const path = location.hash.replace(/^#/, '') || '/';
  const view = (ROUTES[path] || ROUTES['/'])();
  const banner = offlineBanner('Mode offline - data lokal tetap tersedia');

  // Urutan nav: Beranda di kiri, Akun di kanan, sisanya di antara.
  app.innerHTML = `
    ${banner}
    <main>${view}</main>
    <nav class="nav" aria-label="Navigasi utama">
      <div class="nav-inner">
        ${navItem('/', 'Beranda', icons.home, path)}
        ${navItem('/analitik', 'Analitik', icons.chart, path)}
        <a href="#/tambah" aria-label="Tambah transaksi" ${path === '/tambah' ? 'aria-current="page"' : ''}><span class="fab">${icons.plus}</span></a>
        ${navItem('/investasi', 'Investasi', icons.trend, path)}
        ${navItem('/akun', 'Akun', icons.wallet, path)}
      </div>
    </nav>`;
}

// ---------- Event (delegasi) ----------
app.addEventListener('click', (e) => {
  const t = e.target;
  const modeBtn = t.closest('[data-auth-mode]');
  if (modeBtn) return setState({ mode: modeBtn.dataset.authMode, error: '', info: '' });

  if (t.closest('[data-quick]')) return void (location.hash = '#/tambah');
  if (t.closest('[data-group]')) return void (location.hash = '#/akun');

  if (t.closest('[data-logout-start]')) return setState({ confirmLogout: true });
  if (t.closest('[data-logout-cancel]')) return setState({ confirmLogout: false });
  if (t.closest('[data-logout-confirm]')) return void logout();
});

app.addEventListener('submit', (e) => {
  if (e.target.id !== 'auth-form') return;
  e.preventDefault();
  submitAuth(new FormData(e.target));
});

async function submitAuth(form) {
  if (state.busy) return;
  const email = normalizeEmail(form.get('email'));
  const password = String(form.get('password') || '');
  const reg = state.mode === 'register';

  const problem =
    validateEmail(email) ||
    validatePassword(password) ||
    (reg && password !== String(form.get('confirm') || '') ? 'Kata sandi dan pengulangannya tidak sama.' : null);
  if (problem) return setState({ email, error: problem, info: '' });

  setState({ busy: true, email, error: '', info: '' });
  const res = reg ? await auth.signUp(email, password) : await auth.signIn(email, password);

  if (!res.ok) return setState({ busy: false, error: res.error });
  if (res.needsConfirmation) {
    return setState({ busy: false, mode: 'login', info: 'Akun dibuat. Buka email Anda untuk konfirmasi, lalu masuk.' });
  }
  location.hash = '#/';
  setState({ busy: false, status: 'signed-in', session: res.session, stale: false });
}

async function logout() {
  await auth.signOut(); // hanya menghapus sesi; data keuangan lokal tidak disentuh
  location.hash = '#/';
  setState({
    status: 'signed-out', session: null, stale: false, confirmLogout: false,
    mode: 'login', error: '', info: 'Anda telah keluar. Data keuangan di perangkat ini tetap tersimpan.',
  });
}

async function restoreSession() {
  const r = await auth.restore();
  setState({ status: r.state, session: r.session || null, stale: Boolean(r.stale) });
}

window.addEventListener('hashchange', () => state.status === 'signed-in' && render());
window.addEventListener('offline', render);
window.addEventListener('online', () => (state.status === 'signed-in' && state.stale ? restoreSession() : render()));

render();
restoreSession();

// Notifikasi update: pengguna memilih kapan memuat versi baru.
const updateSW = registerSW({
  onNeedRefresh() {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = '<span>Versi baru tersedia.</span><span><button class="ghost" data-later>Nanti</button> <button data-now>Muat ulang</button></span>';
    toast.querySelector('[data-now]').addEventListener('click', () => updateSW(true));
    toast.querySelector('[data-later]').addEventListener('click', () => toast.remove());
    document.body.appendChild(toast);
  },
  onOfflineReady() {
    console.info('Aplikasi siap dipakai offline (application shell tersimpan).');
  },
});
