import { icons } from '../lib/icons.js';
import { formatIDR } from '../lib/currency.js';
import { esc } from '../lib/html.js';

// TASK 1: belum ada database. Semua nilai 0 dan tidak ada data contoh,
// karena grafik/angka final wajib berasal dari data IndexedDB (TASK 3-5).
const GROUPS = [
  { id: 'cash', name: 'Kas', icon: icons.cash },
  { id: 'savings', name: 'Tabungan', icon: icons.savings },
  { id: 'bank', name: 'Saldo Bank', icon: icons.bank },
  { id: 'investments', name: 'Investasi', icon: icons.trend },
];

export function renderHome({ name } = {}) {
  const tiles = GROUPS.map(
    (g) => `
    <button class="group-tile" data-group="${g.id}" aria-label="${g.name}">
      <span class="ico">${g.icon}</span>
      <span class="name">${g.name}</span>
      <span class="value num">${formatIDR(0)}</span>
    </button>`
  ).join('');

  return `
    <header class="header">
      <div>
        <p class="sub">${name ? `Halo, ${esc(name)}` : 'Halo'}</p>
        <h1>Ringkasan Keuangan</h1>
      </div>
      <a class="icon-btn" href="#/profil" aria-label="Profil">${icons.user}</a>
    </header>

    <section class="balance-card" aria-label="Total saldo">
      <p class="label">Total Saldo</p>
      <p class="amount num">${formatIDR(0)}</p>
      <div class="chips">
        <span class="chip">Data tersimpan lokal</span>
        <span class="chip">Transfer tidak dihitung pemasukan/pengeluaran</span>
      </div>
    </section>

    <section aria-label="Aksi cepat">
      <div class="quick">
        <button class="income" data-quick="income">${icons.down}Pemasukan</button>
        <button class="expense" data-quick="expense">${icons.up}Pengeluaran</button>
        <button class="transfer" data-quick="transfer">${icons.swap}Transfer</button>
      </div>
    </section>

    <div class="section-title"><h2>Akun</h2><a class="link" href="#/akun">Kelola</a></div>
    <section class="group-grid">${tiles}</section>

    <div class="section-title"><h2>Transaksi Terbaru</h2></div>
    <section class="card empty">
      <strong>Belum ada transaksi</strong>
      Pencatatan transaksi tersedia di TASK 4.
      <br /><span class="badge">Segera hadir</span>
    </section>
  `;
}
