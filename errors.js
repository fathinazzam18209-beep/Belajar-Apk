// Memetakan respons error Supabase Auth ke pesan bahasa Indonesia.
export const NOT_CONFIGURED = 'Supabase belum dikonfigurasi. Isi file .env terlebih dahulu.';

export function mapAuthError(data, network, status) {
  if (network) return 'Tidak dapat terhubung. Periksa koneksi internet Anda.';

  const d = data || {};
  const code = String(d.error_code || d.error || '').toLowerCase();
  const msg = String(d.msg || d.message || d.error_description || '').toLowerCase();

  if (code === 'invalid_credentials' || msg.includes('invalid login credentials')) {
    return 'Email atau kata sandi salah.';
  }
  if (code === 'email_not_confirmed' || msg.includes('email not confirmed')) {
    return 'Email belum dikonfirmasi. Buka email Anda dan klik tautan konfirmasi.';
  }
  if (code === 'user_already_exists' || msg.includes('already registered')) {
    return 'Email ini sudah terdaftar. Silakan masuk.';
  }
  if (code === 'weak_password') {
    return 'Kata sandi terlalu lemah. Gunakan kombinasi huruf, angka, dan simbol yang sulit ditebak.';
  }
  if (code === 'signup_disabled') return 'Pendaftaran sedang dinonaktifkan.';
  if (status === 429 || code.startsWith('over_')) {
    return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.';
  }
  return 'Terjadi kesalahan. Coba lagi.';
}
