# Cara membuka aplikasi di HP (alamat web + install PWA)

Aplikasi harus di-build dulu (butuh npm), lalu di-hosting. Ada dua jalur. Pilih salah satu.

## Langkah 0 - Supabase (sama untuk kedua jalur, bisa dari HP)
1. Buka supabase.com, buat project baru.
2. Project Settings > API: salin **Project URL** dan **anon public key**. Jangan pakai service_role.
3. Authentication > Providers > Email: untuk uji coba cepat Anda boleh mematikan "Confirm email".
   Bila dibiarkan aktif, setelah daftar Anda harus klik tautan di email sebelum bisa masuk.

## Jalur A - Laptop, paling cepat (sekitar 5 menit)
1. Ekstrak zip. Salin `.env.example` menjadi `.env`, isi dua nilai dari Langkah 0.
2. `npm install`
3. `npm run build`
4. Buka app.netlify.com/drop dan seret folder `dist` ke halaman itu. Anda langsung dapat alamat `https://nama-acak.netlify.app`.
5. Supabase > Authentication > URL Configuration: isi **Site URL** dengan alamat Netlify tadi.

## Jalur B - Netlify membuild sendiri dari GitHub
1. Unggah isi folder proyek ke repo GitHub (jangan sertakan `.env`).
2. Netlify > Add new site > Import from Git > pilih repo. `netlify.toml` sudah mengatur build.
3. Site configuration > Environment variables: tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`, lalu deploy ulang.
4. Isi Site URL di Supabase seperti Jalur A langkah 5.

## Di HP Android (Chrome)
1. Buka alamat Netlify. Daftar lalu masuk.
2. Menu titik tiga > **Instal aplikasi** / Tambahkan ke layar utama.
3. Uji: matikan internet, buka aplikasi dari layar utama. Harus tetap terbuka karena Anda sudah pernah login di perangkat ini.

## Bila ada yang gagal
Kirim pesan error (teks atau tangkapan layar) ke saya. Build dan login belum pernah saya jalankan, jadi kemungkinan ada perbaikan kecil.
