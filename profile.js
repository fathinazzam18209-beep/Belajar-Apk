import { esc } from '../lib/html.js';
import { icons } from '../lib/icons.js';

export function renderProfile({ email, stale, confirming }) {
  const status = stale ? 'Sesi tersimpan (sedang offline)' : 'Sesi aktif';
  return `
    <header class="header">
      <h1>Profil</h1>
      <a class="icon-btn" href="#/" aria-label="Kembali ke beranda">${icons.home}</a>
    </header>

    <section class="card profile-card">
      <span class="avatar">${icons.user}</span>
      <div class="profile-info">
        <p class="profile-email">${esc(email)}</p>
        <span class="chip chip-soft">${status}</span>
      </div>
    </section>

    <section class="card notes">
      <h2>Data Anda</h2>
      <p class="muted">Catatan keuangan tersimpan hanya di perangkat ini. Tidak ada sinkronisasi
      antarperangkat, jadi buka aplikasi di perangkat lain tidak akan menampilkan data yang sama.</p>
      <p class="muted">Keluar dari akun tidak menghapus data keuangan di perangkat ini.</p>
    </section>

    ${confirming ? `
    <section class="card confirm" role="alertdialog" aria-labelledby="logout-title">
      <h2 id="logout-title">Keluar dari akun?</h2>
      <p class="muted">Anda perlu masuk lagi untuk membuka aplikasi. Data keuangan di perangkat ini tetap tersimpan.</p>
      <div class="row">
        <button class="btn btn-ghost" data-logout-cancel>Batal</button>
        <button class="btn btn-danger" data-logout-confirm>Ya, keluar</button>
      </div>
    </section>` : `
    <button class="btn btn-secondary full" data-logout-start>Keluar</button>`}
  `;
}
