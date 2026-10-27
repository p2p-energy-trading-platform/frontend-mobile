export type Point = { x: number; y: number };

/** Smooth line through points (quadratic curves between midpoints). */
export function smoothPath(points: Point[]) {
  if (points.length < 2) return '';

  const first = points[0];
  if (!first) return '';

  let d = `M${first.x},${first.y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const point = points[i];
    const next = points[i + 1];
    if (!point || !next) continue;

    const mx = (point.x + next.x) / 2;
    const my = (point.y + next.y) / 2;
    d += ` Q${point.x},${point.y} ${mx},${my}`;
  }

  const last = points[points.length - 1];
  if (!last) return '';

  return `${d} L${last.x},${last.y}`;
}

export function areaPath(points: Point[], baseline: number) {
  if (points.length < 2) return '';

  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return '';

  return `${smoothPath(points)} L${last.x},${baseline} L${first.x},${baseline} Z`;
}

/** Peak of a series sampled evenly over 24h. */
export function getPeak(values: number[]) {
  if (values.length === 0) {
    return { value: 0, index: 0, time: '00:00' };
  }

  const max = Math.max(...values);
  const index = values.indexOf(max);
  const minutes = Math.round((index / (values.length - 1)) * 24 * 60);
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');

  return { value: max, index, time: `${hh}:${mm}` };
}
