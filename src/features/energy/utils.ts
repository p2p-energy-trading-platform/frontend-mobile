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

export function shiftDate(date: Date, period: Period, direction: 1 | -1) {
  const next = new Date(date);

  if (period === 'day') next.setDate(next.getDate() + direction);
  else if (period === 'week') next.setDate(next.getDate() + 7 * direction);
  else next.setMonth(next.getMonth() + direction);

  return next;
}

export function formatPeriodLabel(date: Date, period: Period) {
  if (period === 'day') {
    return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
  }

  if (period === 'week') {
    // Monday → Sunday containing the date
    const offsetToMonday = (date.getDay() + 6) % 7;
    const start = new Date(date);
    start.setDate(date.getDate() - offsetToMonday);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.getDate()} ${MONTHS[start.getMonth()]} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
  }

  return `${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`;
}

/** True when stepping forward would go past today. */
export function isAtLatest(date: Date, period: Period) {
  return shiftDate(date, period, 1).getTime() > Date.now();
}
