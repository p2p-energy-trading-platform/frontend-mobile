import { formatAed, formatAmount } from './format';

describe('formatAmount', () => {
  it('formats with thousands separators and fixed decimals', () => {
    expect(formatAmount(1284.5)).toBe('1,284.50');
    expect(formatAmount(0.47, 3)).toBe('0.470');
  });
});

describe('formatAed', () => {
  it('prefixes the currency', () => {
    expect(formatAed(2847.5)).toBe('AED 2,847.50');
    expect(formatAed(0.47, 3)).toBe('AED 0.470');
  });
});
