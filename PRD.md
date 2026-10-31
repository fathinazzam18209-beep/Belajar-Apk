# PRD - Personal Finance Tracker (PWA)

Ringkasan keputusan final (sumber: Project Master Instruction).

- Platform: PWA, mobile-first, offline-first, bahasa Indonesia, IDR.
- Frontend: HTML5, CSS3, JavaScript; build Vite; DB IndexedDB (Dexie.js); grafik Chart.js; hosting Netlify.
- Autentikasi: Supabase Auth **saja**. Data keuangan tidak pernah dikirim ke Supabase. Tidak ada klaim sinkronisasi.
- Grup akun: Kas, Tabungan, Saldo Bank, Investasi (banyak akun per grup; CRUD, saldo awal, saldo kini, riwayat).
- Transaksi: Pemasukan, Pengeluaran, Transfer (nominal, akun, kategori, tanggal, catatan opsional).
  Aturan: transfer tidak dihitung pemasukan/pengeluaran; transfer = pasangan debit-kredit seimbang; cegah duplikat; validasi saldo; kalkulasi decimal-safe (integer Rupiah); satu rumus total.
- Analitik: mingguan, bulanan, tahunan, rentang kustom; bar/line/pie/tabel/ringkasan angka; filter akun, grup, kategori, tipe, tanggal; data dari database nyata.
- Investasi: nama aset, modal awal, tambahan modal, penarikan, nilai pasar manual, riwayat valuasi, untung/rugi, persentase return; setoran dipisahkan dari keuntungan.
- PWA: manifest, service worker, HTTPS, ikon, standalone, offline shell, cache management, notifikasi update, responsif; Safari iOS + Chrome Android. Tidak mengklaim login offline sebelum ada sesi valid.
- Proteksi data: simpan lokal, backup/restore JSON, ekspor CSV, logout tidak menghapus data, peringatan sebelum aksi destruktif, tanpa password/PIN plaintext.

## Referensi UI
Tema gelap indigo: kartu saldo gradien, grid ikon aksi, kartu tabungan/kategori, daftar transaksi, navigasi bawah dengan tombol tambah. Diadaptasi ke fitur di atas; elemen non-PRD (kirim uang ke penerima, split bill, exchange mata uang, diagnosis AI) tidak dipakai.
