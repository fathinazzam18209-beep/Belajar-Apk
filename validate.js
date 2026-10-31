export const MIN_PASSWORD = 8;

export function normalizeEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

// Mengembalikan pesan error (string) atau null bila valid.
export function validateEmail(email) {
  const e = normalizeEmail(email);
  if (!e) return 'Email wajib diisi.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Format email tidak valid.';
  return null;
}

export function validatePassword(password) {
  if (!password) return 'Kata sandi wajib diisi.';
  if (password.length < MIN_PASSWORD) return `Kata sandi minimal ${MIN_PASSWORD} karakter.`;
  return null;
}
