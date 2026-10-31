const PAGES = {
  akun: { title: 'Akun', body: 'Kelola akun Kas, Tabungan, Saldo Bank, dan Investasi.', task: 'TASK 3' },
  tambah: { title: 'Tambah Transaksi', body: 'Pemasukan, pengeluaran, dan transfer dengan input cepat.', task: 'TASK 4' },
  analitik: { title: 'Analitik', body: 'Mingguan, bulanan, tahunan, dan rentang kustom dengan grafik pilihan Anda.', task: 'TASK 6' },
  investasi: { title: 'Investasi', body: 'Kinerja aset: modal, tambahan modal, penarikan, nilai pasar, untung/rugi.', task: 'TASK 7' },
};

export function renderPlaceholder(key) {
  const page = PAGES[key];
  return `
    <header class="header"><h1>${page.title}</h1></header>
    <section class="card empty">
      <strong>${page.title}</strong>
      ${page.body}
      <br /><span class="badge">Direncanakan di ${page.task}</span>
    </section>
  `;
}
