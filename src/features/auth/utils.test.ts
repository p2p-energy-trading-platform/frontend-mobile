import { isValidSriLankanNicNumber, toIsoDate } from './utils';

describe('isValidSriLankanNicNumber', () => {
  it.each(['199012345678', '199062345678', '200036612345'])('accepts new format %s', (nic) => {
    expect(isValidSriLankanNicNumber(nic)).toBe(true);
  });

  it.each(['901234567V', '901234567v', '906234567X', ' 901234567V '])(
    'accepts old format %s',
    (nic) => {
      expect(isValidSriLankanNicNumber(nic)).toBe(true);
    },
  );

  it.each([
    ['empty', ''],
    ['too short', '12345'],
    ['wrong letter', '901234567A'],
    ['day 000', '199000012345'],
    ['day 366 in a non-leap year', '199036612345'],
    ['day 367', '200036712345'],
    ['future year', '209912345678'],
  ])('rejects %s', (_label, nic) => {
    expect(isValidSriLankanNicNumber(nic)).toBe(false);
  });
});

describe('toIsoDate', () => {
  it('converts DD/MM/YYYY to YYYY-MM-DD', () => {
    expect(toIsoDate('15/03/1995')).toBe('1995-03-15');
    expect(toIsoDate('29/02/2024')).toBe('2024-02-29');
  });

  it.each(['31/02/2020', '29/02/2023', '32/01/2020', '00/01/2020', '1995-03-15', '5/3/1995', ''])(
    'returns undefined for %p',
    (value) => {
      expect(toIsoDate(value)).toBeUndefined();
    },
  );
});
