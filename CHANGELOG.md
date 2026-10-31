# CHANGELOG

## [Unreleased] - 2026-10-31
### Added (TASK 2)
- Autentikasi Supabase via REST: daftar, masuk, keluar, restore/refresh sesi.
- Layar masuk/daftar, halaman profil dengan konfirmasi keluar, penjaga login.
- 16 tes unit auth (fetch tiruan).
- `.env.example` untuk URL dan anon key Supabase.

### Changed
- Navigasi bawah: Beranda di kiri, Akun di kanan (Analitik, tambah, Investasi di tengah).
- Sapaan beranda memakai bagian depan email, bukan nama tetap.

### Added (TASK 1)
- Struktur proyek Vite, design system gelap indigo, UI beranda mobile-first.
- Konfigurasi PWA (manifest, service worker, ikon, notifikasi update, banner offline).
- Util Rupiah integer + 5 tes unit.

### Catatan
- Build belum diverifikasi (npm registry tidak terjangkau dari sandbox).
