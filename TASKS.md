# TASKS

## TASK 1 - Project Setup and PWA Foundation: KODE DITULIS, BUILD BELUM TERVERIFIKASI
Files: index.html, vite.config.js, package.json, public/* (ikon), src/main.js, src/styles/*, src/lib/{currency,icons}.js, src/views/{home,placeholder}.js, tests/currency.test.js, README/PRD/TASKS/CHANGELOG.
Tested: `npm test` (currency) lulus.
NOT tested: `npm install` dan `npm run build` (registry npm tidak terjangkau dari sandbox), tampilan di browser asli, service worker, instal PWA.

### Perubahan setelah permintaan pemilik
- Navigasi bawah: Beranda (kiri), Analitik, tombol tambah, Investasi, Akun (kanan).

## TASK 2 - Authentication: KODE DITULIS, UJI UNIT LULUS, BELUM DIUJI TERHADAP SUPABASE NYATA

### Files created
src/auth/{client,errors,validate}.js, src/lib/html.js, src/views/{auth,profile}.js, tests/auth.test.js, .env.example

### Files modified
src/main.js (penjaga login, event auth, urutan nav), src/views/home.js (sapaan dari email, tombol profil), src/lib/icons.js (ikon user), src/styles/components.css (form/auth), TASKS.md, CHANGELOG.md, README.md

### Fitur
- Daftar, masuk, keluar via Supabase Auth REST (tanpa dependensi tambahan). Supabase hanya untuk autentikasi.
- Sesi (token, bukan kata sandi) disimpan di localStorage; restore + refresh token saat aplikasi dibuka.
- Offline: hanya jika sesi valid pernah dibuat di perangkat ini. Login pertama wajib online.
- Logout menghapus sesi saja; data keuangan lokal tidak disentuh. Konfirmasi tampil di halaman sebelum keluar.
- Pesan error Bahasa Indonesia; layar petunjuk bila .env belum diisi.

### Tests performed
- `npm test`: 21/21 lulus (16 auth dengan fetch tiruan + 5 currency). Mencakup: login/daftar, error, konfirmasi email, restore (valid, refresh, ditolak, offline), logout tidak menghapus data lain, kata sandi tidak tersimpan.
- Cek sintaks semua file sumber.

### NOT tested
- Alur nyata dengan project Supabase (butuh URL + anon key milik Anda).
- Build, tampilan UI asli di perangkat, perilaku di Safari iOS.

### Known risks / catatan
- Token di localStorage rentan bila ada XSS; input pengguna di-escape sebelum dirender.
- Logout `scope=local` best-effort; bila offline, token di server baru berakhir sesuai masa berlakunya.
- Pengaturan Supabase yang perlu Anda atur: Authentication > URL Configuration (Site URL), dan pilih apakah konfirmasi email aktif.

### Remaining
Isi .env, jalankan alur daftar/masuk/keluar secara nyata, laporkan hasilnya.
Panduan: lihat DEPLOY.md. package.json kini mencantumkan vite ^7 dan vite-plugin-pwa ^1 (versi belum pernah di-install di sandbox; bila `npm install` menolak, laporkan pesannya).
netlify.toml ditambahkan lebih awal dari TASK 10 agar aplikasi bisa diakses dari HP.

## TASK 3-10: belum dimulai
3 IndexedDB & Account Management, 4 Transaction Engine, 5 Dashboard, 6 Financial Analytics, 7 Investment Performance, 8 Backup and Security, 9 Testing, 10 Netlify Deployment.
