import test from 'node:test';
import assert from 'node:assert/strict';
import { formatIDR, parseIDR } from '../src/lib/currency.js';

test('parseIDR menerima format titik ribuan', () => assert.equal(parseIDR('1.500.000'), 1500000));
test('parseIDR menerima angka polos', () => assert.equal(parseIDR('25000'), 25000));
test('parseIDR menolak desimal/huruf', () => {
  assert.equal(parseIDR('12,5'), null);
  assert.equal(parseIDR('abc'), null);
  assert.equal(parseIDR(''), null);
});
test('formatIDR menolak pecahan', () => assert.throws(() => formatIDR(10.5), TypeError));
test('formatIDR memuat Rp dan pemisah ribuan', () => {
  const out = formatIDR(1500000).replace(/ /g, ' ');
  assert.match(out, /^Rp\s?1\.500\.000$/);
});
