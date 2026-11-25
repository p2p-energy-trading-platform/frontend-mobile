import { KYC_ALLOWED_MIME_TYPES, KYC_MAX_FILE_SIZE_MB } from './constants';
import type {
  KycErrors,
  KycValues,
  PickedDocument,
  SignInErrors,
  SignInValues,
  SignUpErrors,
  SignUpValues,
  SmartMeterErrors,
  SmartMeterValues,
} from './types';

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

//The backend rejects full names longer than this.
export const FULL_NAME_MAX_LENGTH = 255;

export function isValidEmail(value: string) {
  const email = value.trim();
  return email.length <= 254 && EMAIL_PATTERN.test(email);
}

/** Returns an error message when the full name is empty or too long, otherwise undefined. */
export function getFullNameError(value: string) {
  const fullName = value.trim();

  if (!fullName) return 'Full legal name is required';

  if (fullName.length > FULL_NAME_MAX_LENGTH) {
    return `Full legal name must be ${FULL_NAME_MAX_LENGTH} characters or fewer`;
  }

  return undefined;
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
export const PASSWORD_MIN_LENGTH = 8;

/** A new password needs 8 to 128 characters, with at least one letter and one number. */
export function isValidNewPassword(password: string) {
  return (
    password.length >= PASSWORD_MIN_LENGTH &&
    password.length <= PASSWORD_MAX_LENGTH &&
    /[A-Za-z]/.test(password) &&
    /\d/.test(password)
  );
}

/** Returns an error message per invalid sign-up field; an empty object means the form is valid. */
export function getSignUpErrors({
  fullName,
  email,
  password,
  confirmation,
  accepted,
}: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {};

  const fullNameError = getFullNameError(fullName);
  if (fullNameError) errors.fullName = fullNameError;

  if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!isValidNewPassword(password)) {
    errors.password = `Password must be ${PASSWORD_MIN_LENGTH} to ${PASSWORD_MAX_LENGTH} characters, with a letter and a number`;
  }

  if (!confirmation) {
    errors.confirmation = 'Confirm your password';
  } else if (confirmation !== password) {
    errors.confirmation = 'Passwords do not match';
  }

  if (!accepted) {
    errors.terms = 'You must accept the terms to continue';
  }

  return errors;
}
export const OTP_LENGTH = 6;

export function isValidOtp(code: string) {
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code);
}

const MASKED_CHARACTERS_MAX = 11;

/** "sampleperson1@example.ae" -> "sa•••••••••••@example.ae" */
export function maskEmail(email: string) {
  const [user = '', domain = ''] = email.trim().split('@');

  if (!domain) return email;

  const visible = user.length <= 2 ? user.slice(0, 1) : user.slice(0, 2);
  const hidden = '•'.repeat(Math.min(user.length - visible.length, MASKED_CHARACTERS_MAX));

  return `${visible}${hidden}@${domain}`;
}

/** "12122000" -> "12/12/2000": keeps digits only and adds the slashes while typing. */
export function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);

  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const MINIMUM_AGE = 18;

/** True when the ISO date (YYYY-MM-DD) is at least 18 years before today. */
export function isAdult(isoDate: string, today = new Date()) {
  const [year = 0, month = 0, day = 0] = isoDate.split('-').map(Number);

  const cutoff = Date.UTC(
    today.getUTCFullYear() - MINIMUM_AGE,
    today.getUTCMonth(),
    today.getUTCDate(),
  );

  return Date.UTC(year, month - 1, day) <= cutoff;
}

/** Returns an error message when the picked file is not allowed, otherwise undefined. */
export function getDocumentError(document: Pick<PickedDocument, 'mimeType' | 'size'>) {
  if (!(KYC_ALLOWED_MIME_TYPES as readonly string[]).includes(document.mimeType)) {
    return 'Use a JPG, PNG or PDF file';
  }

  if (document.size !== undefined && document.size > KYC_MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `File must be ${KYC_MAX_FILE_SIZE_MB} MB or smaller`;
  }

  return undefined;
}

/** Returns an error message per invalid KYC field; an empty object means the form is valid. */
export function getKycErrors({
  fullName,
  nic,
  dateOfBirth,
  nationality,
  documents,
}: KycValues): KycErrors {
  const errors: KycErrors = {};

  const fullNameError = getFullNameError(fullName);
  if (fullNameError) errors.fullName = fullNameError;

  if (!isValidSriLankanNicNumber(nic)) errors.nic = 'Enter a valid Sri Lankan NIC number';

  const isoDate = toIsoDate(dateOfBirth);
  if (!isoDate) {
    errors.dateOfBirth = 'Use DD/MM/YYYY';
  } else if (!isAdult(isoDate)) {
    errors.dateOfBirth = 'You must be 18 or over';
  }

  if (!nationality) errors.nationality = 'Select your nationality';

  if (!documents.idFront || !documents.idBack || !documents.selfie) {
    errors.documents = 'Upload all three documents';
  }

  return errors;
}

/** Meter serials are letters, digits and dashes, e.g. "DEWA-2024-00012345". */
export function isValidMeterSerial(value: string) {
  return /^[A-Z0-9][A-Z0-9-]{5,29}$/.test(value.trim().toUpperCase());
}

/** Returns an error message per invalid smart meter field; an empty object means the form is valid. */
export function getSmartMeterErrors({ serial, zone }: SmartMeterValues): SmartMeterErrors {
  const errors: SmartMeterErrors = {};

  if (!isValidMeterSerial(serial)) {
    errors.serial = 'Enter a valid meter serial number';
  }

  if (!zone) {
    errors.zone = 'Select your grid zone';
  }

  return errors;
}
