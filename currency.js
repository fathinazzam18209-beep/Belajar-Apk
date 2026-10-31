// Rupiah disimpan sebagai bilangan bulat (integer) - tanpa floating point.
// Semua kalkulasi uang nanti memakai integer ini (aturan PRD: decimal-safe).

const fmt = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatIDR(amount) {
  if (!Number.isSafeInteger(amount)) throw new TypeError('Nominal harus bilangan bulat Rupiah');
  return fmt.format(amount);
}

// Mengubah input pengguna ("1.500.000" / "1500000") menjadi integer, atau null bila tidak valid.
export function parseIDR(input) {
  const digits = String(input).replace(/[.\s]/g, '').replace(/^Rp/i, '');
  if (!/^\d+$/.test(digits)) return null;
  const n = Number(digits);
  return Number.isSafeInteger(n) ? n : null;
}
