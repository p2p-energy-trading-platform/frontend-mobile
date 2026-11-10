import { formatPeriodLabel, isAtLatest, shiftDate, startOfPeriod } from './utils';

describe('shiftDate', () => {
  it('clamps to the last day of a shorter month', () => {
    expect(shiftDate(new Date(2026, 9, 31), 'month', -1)).toEqual(new Date(2026, 8, 30));
    expect(shiftDate(new Date(2026, 0, 31), 'month', 1)).toEqual(new Date(2026, 1, 28));
    expect(shiftDate(new Date(2024, 0, 31), 'month', 1)).toEqual(new Date(2024, 1, 29));
  });

  it('moves by one day and one week', () => {
    expect(shiftDate(new Date(2026, 10, 30), 'day', 1)).toEqual(new Date(2026, 11, 1));
    expect(shiftDate(new Date(2026, 10, 11), 'week', -1)).toEqual(new Date(2026, 10, 4));
  });
});

describe('startOfPeriod', () => {
  it('starts weeks on Monday', () => {
    expect(startOfPeriod(new Date(2026, 10, 11), 'week')).toEqual(new Date(2026, 10, 9));
    expect(startOfPeriod(new Date(2026, 10, 15), 'week')).toEqual(new Date(2026, 10, 9));
  });
});

describe('isAtLatest', () => {
  const now = new Date(2026, 10, 11, 10, 0);

  it('handles day periods', () => {
    expect(isAtLatest(new Date(2026, 10, 11), 'day', now)).toBe(true);
    expect(isAtLatest(new Date(2026, 10, 10), 'day', now)).toBe(false);
  });

  it('handles week periods', () => {
    expect(isAtLatest(new Date(2026, 10, 9), 'week', now)).toBe(true);
    expect(isAtLatest(new Date(2026, 10, 8), 'week', now)).toBe(false);
  });

  it('handles month periods', () => {
    expect(isAtLatest(new Date(2026, 10, 1), 'month', now)).toBe(true);
    expect(isAtLatest(new Date(2026, 9, 31), 'month', now)).toBe(false);
  });
});

describe('formatPeriodLabel', () => {
  it('formats a week as Monday to Sunday', () => {
    expect(formatPeriodLabel(new Date(2026, 10, 11), 'week')).toBe('9 Nov – 15 Nov');
  });

  it('formats a week that spans two months', () => {
    expect(formatPeriodLabel(new Date(2026, 9, 31), 'week')).toBe('26 Oct – 1 Nov');
  });

  it('formats day and month periods', () => {
    expect(formatPeriodLabel(new Date(2026, 10, 11), 'day')).toBe('Wed, 11 Nov');
    expect(formatPeriodLabel(new Date(2026, 10, 11), 'month')).toBe('November 2026');
  });
});
