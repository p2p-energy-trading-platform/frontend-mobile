export type Period = 'day' | 'week' | 'month';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function startOfPeriod(date: Date, period: Period) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (period === 'week') start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  else if (period === 'month') start.setDate(1);

  return start;
}

export function shiftDate(date: Date, period: Period, direction: 1 | -1) {
  const next = new Date(date);

  if (period === 'day') next.setDate(next.getDate() + direction);
  else if (period === 'week') next.setDate(next.getDate() + 7 * direction);
  else {
    const day = next.getDate();
    next.setDate(1);
    next.setMonth(next.getMonth() + direction);
    const daysInMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
    next.setDate(Math.min(day, daysInMonth));
  }

  return next;
}

export function formatPeriodLabel(date: Date, period: Period) {
  if (period === 'day') {
    return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }

  if (period === 'week') {
    const start = startOfPeriod(date, 'week');
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
  }

  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** True when the next period starts in the future, i.e. `date` is in the current period. */
export function isAtLatest(date: Date, period: Period, now = new Date()) {
  return startOfPeriod(shiftDate(date, period, 1), period).getTime() > now.getTime();
}
