import { esc } from '../lib/html.js';
import { icons } from '../lib/icons.js';

export function renderAuth({ mode, configured, error, info, busy, email }) {
  if (!configured) {
    return `
      <section class="auth">
        <div class="card empty">
          <strong>Supabase belum dikonfigurasi</strong>
          Salin <code>.env.example</code> menjadi <code>.env</code>, isi
          <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code>,
          lalu jalankan ulang aplikasi.
        </div>
      </section>`;
  }

  const reg = mode === 'register';
  return `
    <section class="auth">
      <div class="auth-brand">
        <span class="auth-logo">${icons.chart}</span>
        <h1>Personal Finance Tracker</h1>
        <p class="muted">Masuk untuk membuka catatan keuangan Anda.</p>
      </div>

      <div class="seg" role="tablist" aria-label="Masuk atau daftar">
        <button role="tab" aria-selected="${!reg}" data-auth-mode="login">Masuk</button>
        <button role="tab" aria-selected="${reg}" data-auth-mode="register">Daftar</button>
      </div>

      <form id="auth-form" class="form" novalidate>
        ${info ? `<p class="note note-ok" role="status">${esc(info)}</p>` : ''}
        ${error ? `<p class="note note-err" role="alert">${esc(error)}</p>` : ''}

        <label for="auth-email">Email</label>
        <input id="auth-email" name="email" type="email" inputmode="email"
               autocomplete="email" autocapitalize="off" value="${esc(email)}" required />

        <label for="auth-password">Kata sandi</label>
        <input id="auth-password" name="password" type="password"
               autocomplete="${reg ? 'new-password' : 'current-password'}" minlength="8" required />

        ${reg ? `
        <label for="auth-confirm">Ulangi kata sandi</label>
        <input id="auth-confirm" name="confirm" type="password" autocomplete="new-password" minlength="8" required />
        <p class="hint">Minimal 8 karakter.</p>` : ''}

        <button class="btn btn-primary" type="submit" ${busy ? 'disabled' : ''}>
          ${busy ? 'Memproses...' : reg ? 'Buat akun' : 'Masuk'}
        </button>
      </form>

      <p class="hint center">
        Email dan kata sandi hanya dipakai untuk login. Catatan keuangan tersimpan di
        perangkat ini dan tidak dikirim ke server.
      </p>
    </section>`;
}
