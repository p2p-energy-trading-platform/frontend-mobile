import type { SignInErrors, SignInValues } from './types';

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MAX_LENGTH = 128;

export function isValidEmail(value: string) {
  const email = value.trim();
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

/** Returns an error message per invalid sign-in field; an empty object means the form is valid. */
export function getSignInErrors({ email, password }: SignInValues): SignInErrors {
  const errors: SignInErrors = {};

  if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`;
  }

  return errors;
}
