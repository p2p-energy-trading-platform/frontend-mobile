import { formatDateTime, getGreeting } from './utils';

describe('getGreeting', () => {
  it.each([
    [0, 'Good morning'],
    [11, 'Good morning'],
    [12, 'Good afternoon'],
    [17, 'Good afternoon'],
    [18, 'Good evening'],
    [23, 'Good evening'],
  ])('at %i:00 says %s', (hour, greeting) => {
    expect(getGreeting(new Date(2026, 10, 11, hour))).toBe(greeting);
  });
});

describe('formatDateTime', () => {
  it('formats the date and 24h time', () => {
    // The comma after the weekday depends on the ICU version.
    expect(formatDateTime(new Date(2026, 10, 11, 14, 5))).toMatch(
      /^Wednesday,? 11 Nov 2026 · 14:05$/,
    );
  });
});
