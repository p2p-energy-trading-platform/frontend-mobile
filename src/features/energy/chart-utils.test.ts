import { areaPath, getPeak, smoothPath } from './chart-utils';

describe('getPeak', () => {
  it('returns zeros for an empty series', () => {
    expect(getPeak([])).toEqual({ value: 0, index: 0, time: '00:00' });
  });

  it('handles a single sample', () => {
    expect(getPeak([4.2])).toEqual({ value: 4.2, index: 0, time: '00:00' });
  });

  it('maps 49 half-hour samples onto 24h', () => {
    const values = Array.from({ length: 49 }, (_, i) => (i === 27 ? 9 : 1));

    expect(getPeak(values)).toEqual({ value: 9, index: 27, time: '13:30' });
  });

  it('picks the first index when the peak repeats', () => {
    expect(getPeak([1, 5, 5, 2]).index).toBe(1);
  });
});

describe('smoothPath', () => {
  it('returns an empty path for fewer than 2 points', () => {
    expect(smoothPath([])).toBe('');
    expect(smoothPath([{ x: 0, y: 0 }])).toBe('');
  });

  it('draws a straight line for 2 points', () => {
    expect(
      smoothPath([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
      ]),
    ).toBe('M0,0 L10,10');
  });

  it('curves through midpoints for 3 points', () => {
    expect(
      smoothPath([
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: 0 },
      ]),
    ).toBe('M0,0 Q10,10 15,5 L20,0');
  });
});

describe('areaPath', () => {
  it('closes the path down to the baseline', () => {
    expect(
      areaPath(
        [
          { x: 0, y: 0 },
          { x: 10, y: 10 },
        ],
        50,
      ),
    ).toBe('M0,0 L10,10 L10,50 L0,50 Z');
  });

  it('returns an empty path for fewer than 2 points', () => {
    expect(areaPath([{ x: 0, y: 0 }], 50)).toBe('');
  });
});
