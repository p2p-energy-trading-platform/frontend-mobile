// Utility functions for authentication-related tasks.
export function toIsoDate(value: string): string | undefined {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return undefined;
  const [, day, month, year] = match;
  const iso = `${year}-${month}-${day}`;
  const date = new Date(`${iso}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : undefined;
}

// Validates a Sri Lankan NIC number (both old and new formats).
export function isValidSriLankanNicNumber(value: string) {
  const nic = value.trim().toUpperCase();

  let year: number;
  let dayOfYear: number;

  if (/^\d{12}$/.test(nic)) {
    year = Number(nic.slice(0, 4));
    dayOfYear = Number(nic.slice(4, 7));
  } else if (/^\d{9}[VX]$/.test(nic)) {
    year = 1900 + Number(nic.slice(0, 2));
    dayOfYear = Number(nic.slice(2, 5));
  } else {
    return false;
  }

  if (dayOfYear > 500) dayOfYear -= 500;

  const daysInYear = new Date(Date.UTC(year, 1, 29)).getUTCDate() === 29 ? 366 : 365;

  return (
    year >= 1900 && year <= new Date().getUTCFullYear() && dayOfYear >= 1 && dayOfYear <= daysInYear
  );
}
