# Personal Finance Tracker (PWA)

Aplikasi pencatat keuangan pribadi: mobile-first, offline-first, bahasa Indonesia, mata uang Rupiah.
Data keuangan disimpan **hanya di perangkat** (IndexedDB). Tidak ada sinkronisasi antarperangkat.

## Stack
Vite, HTML/CSS/JavaScript, vite-plugin-pwa. Rencana: Dexie.js (TASK 3), Chart.js (TASK 6), Supabase Auth hanya untuk login (TASK 2), Netlify (TASK 10).

## Konfigurasi Supabase (hanya untuk login)
1. Buat project di Supabase, ambil Project URL dan anon (public) key dari Project Settings > API.
2. `cp .env.example .env`, isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Jangan pernah memakai service_role key di frontend. Jangan commit `.env`.
4. Authentication > URL Configuration: isi Site URL dengan alamat aplikasi. Anda juga memilih apakah konfirmasi email aktif.

Supabase tidak menyimpan transaksi. Data keuangan hanya di IndexedDB perangkat ini.

## Menjalankan
```bash
npm install
npm install -D vite vite-plugin-pwa   # jika belum tercantum di devDependencies
npm run dev        # pratinjau di http://localhost:5173 (juga bisa dibuka dari HP via IP laptop)
npm run build      # build produksi ke dist/
npm run preview    # uji build + service worker
npm test           # tes unit (tanpa dependensi)
```
Service worker hanya aktif pada build (`npm run build && npm run preview`) atau HTTPS.

## Struktur
```
index.html, vite.config.js
public/   ikon PWA (svg + png)
src/main.js           router hash, navigasi, notifikasi update PWA
src/styles/           tokens.css (design system), base.css, components.css
src/lib/              currency.js (Rupiah integer), icons.js
src/views/            home.js, placeholder.js
tests/                currency.test.js
```

## Status
Lihat `TASKS.md` dan `CHANGELOG.md`.
