import { KYC_MAX_FILE_SIZE_MB } from './constants';
import {
  FULL_NAME_MAX_LENGTH,
  getDocumentError,
  getFullNameError,
  getKycErrors,
  getSignInErrors,
  getSignUpErrors,
  isValidEmail,
  isValidNewPassword,
  isValidOtp,
  isValidSriLankanNicNumber,
  maskEmail,
  PASSWORD_MAX_LENGTH,
  toIsoDate,
} from './utils';

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

describe('isValidEmail', () => {
  it.each(['name@example.com', ' name@example.com ', 'first.last@mail.co.lk'])(
    'accepts %s',
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    },
  );

  it.each(['', 'name', 'name@', '@example.com', 'name@example', 'na me@example.com'])(
    'rejects "%s"',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe('getFullNameError', () => {
  it.each(['Jane Doe', ' Jane Doe ', 'a'.repeat(FULL_NAME_MAX_LENGTH)])('accepts %p', (name) => {
    expect(getFullNameError(name)).toBeUndefined();
  });

  it.each(['', '   '])('requires a name, rejecting %p', (name) => {
    expect(getFullNameError(name)).toBe('Full legal name is required');
  });

  it('rejects a name longer than the maximum', () => {
    expect(getFullNameError('a'.repeat(FULL_NAME_MAX_LENGTH + 1))).toBe(
      `Full legal name must be ${FULL_NAME_MAX_LENGTH} characters or fewer`,
    );
  });

  it('does not count surrounding whitespace towards the maximum', () => {
    expect(getFullNameError(` ${'a'.repeat(FULL_NAME_MAX_LENGTH)} `)).toBeUndefined();
  });
});

describe('getSignInErrors', () => {
  it('returns no errors for a valid email and password', () => {
    expect(getSignInErrors({ email: 'name@example.com', password: 'secret' })).toEqual({});
  });

  it('requires a valid email and a password', () => {
    expect(getSignInErrors({ email: 'nope', password: '' })).toEqual({
      email: 'Enter a valid email address',
      password: 'Password is required',
    });
  });

  it('rejects a password longer than the maximum', () => {
    const errors = getSignInErrors({
      email: 'name@example.com',
      password: 'a'.repeat(PASSWORD_MAX_LENGTH + 1),
    });

    expect(errors.password).toBe(`Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`);
  });
});

describe('isValidNewPassword', () => {
  it.each(['abcdefg1', 'Passw0rdLong', '12345678a'])('accepts %s', (password) => {
    expect(isValidNewPassword(password)).toBe(true);
  });

  it.each([
    ['too short', 'abc123'],
    ['no number', 'abcdefghi'],
    ['no letter', '123456789'],
    ['too long', `a1${'x'.repeat(PASSWORD_MAX_LENGTH)}`],
  ])('rejects a password that is %s', (_reason, password) => {
    expect(isValidNewPassword(password)).toBe(false);
  });
});

describe('getSignUpErrors', () => {
  const valid = {
    fullName: 'Jane Doe',
    email: 'name@example.com',
    password: 'secret123',
    confirmation: 'secret123',
    accepted: true,
  };

  it('returns no errors for valid details', () => {
    expect(getSignUpErrors(valid)).toEqual({});
  });

  it('reports every invalid field', () => {
    const errors = getSignUpErrors({
      fullName: '',
      email: 'nope',
      password: 'abc',
      confirmation: '',
      accepted: false,
    });

    expect(Object.keys(errors).sort()).toEqual([
      'confirmation',
      'email',
      'fullName',
      'password',
      'terms',
    ]);
    expect(errors.confirmation).toBe('Confirm your password');
  });

  it('requires a full name', () => {
    expect(getSignUpErrors({ ...valid, fullName: '  ' }).fullName).toBe(
      'Full legal name is required',
    );
  });

  it('rejects a full name longer than the maximum', () => {
    expect(
      getSignUpErrors({ ...valid, fullName: 'a'.repeat(FULL_NAME_MAX_LENGTH + 1) }).fullName,
    ).toBe(`Full legal name must be ${FULL_NAME_MAX_LENGTH} characters or fewer`);
  });

  it('reports a confirmation that does not match', () => {
    expect(getSignUpErrors({ ...valid, confirmation: 'different1' }).confirmation).toBe(
      'Passwords do not match',
    );
  });
});

describe('getDocumentError', () => {
  const MB = 1024 * 1024;

  it.each(['image/jpeg', 'image/png', 'application/pdf'])('accepts a small %s file', (mimeType) => {
    expect(getDocumentError({ mimeType, size: 1024 })).toBeUndefined();
  });

  it('accepts a file when the picker could not read its size', () => {
    expect(getDocumentError({ mimeType: 'image/png', size: undefined })).toBeUndefined();
  });

  it('accepts a file exactly at the size limit', () => {
    expect(
      getDocumentError({ mimeType: 'application/pdf', size: KYC_MAX_FILE_SIZE_MB * MB }),
    ).toBeUndefined();
  });

  it('uses the same 10 MB limit as the web app and backend', () => {
    expect(KYC_MAX_FILE_SIZE_MB).toBe(10);
    expect(getDocumentError({ mimeType: 'image/jpeg', size: 6 * MB })).toBeUndefined();
  });

  it('rejects a file over the size limit', () => {
    expect(
      getDocumentError({ mimeType: 'application/pdf', size: KYC_MAX_FILE_SIZE_MB * MB + 1 }),
    ).toBe(`File must be ${KYC_MAX_FILE_SIZE_MB} MB or smaller`);
  });

  it('rejects an empty file', () => {
    expect(getDocumentError({ mimeType: 'image/jpeg', size: 0 })).toBe('File is empty');
  });

  it.each(['image/gif', 'text/plain', ''])('rejects the file type %p', (mimeType) => {
    expect(getDocumentError({ mimeType, size: 1024 })).toBe('Use a JPG, PNG or PDF file');
  });
});

describe('getKycErrors', () => {
  const document = {
    uri: 'file:///cache/nic.jpg',
    name: 'nic.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
  };

  const valid = {
    fullName: 'Jane Doe',
    nic: '199012345678',
    dateOfBirth: '15/03/1995',
    documents: { nic: document },
  };

  it('returns no errors for valid details', () => {
    expect(getKycErrors(valid)).toEqual({});
  });

  it('requires a full name', () => {
    expect(getKycErrors({ ...valid, fullName: '   ' }).fullName).toBe(
      'Full legal name is required',
    );
  });

  it('rejects a full name longer than the maximum', () => {
    expect(
      getKycErrors({ ...valid, fullName: 'a'.repeat(FULL_NAME_MAX_LENGTH + 1) }).fullName,
    ).toBe(`Full legal name must be ${FULL_NAME_MAX_LENGTH} characters or fewer`);
  });

  it('accepts a full name exactly at the maximum', () => {
    expect(
      getKycErrors({ ...valid, fullName: 'a'.repeat(FULL_NAME_MAX_LENGTH) }).fullName,
    ).toBeUndefined();
  });

  it('requires the NIC document', () => {
    expect(getKycErrors({ ...valid, documents: {} }).documents).toBe('Upload your NIC ID');
  });
});

describe('isValidOtp', () => {
  it('accepts exactly six digits', () => {
    expect(isValidOtp('123456')).toBe(true);
  });

  it.each(['', '12345', '1234567', '12345a', '12 456', '      '])('rejects "%s"', (code) => {
    expect(isValidOtp(code)).toBe(false);
  });
});

describe('maskEmail', () => {
  it('keeps the first two characters and the domain', () => {
    expect(maskEmail('sampleperson1@example.ae')).toBe('sa•••••••••••@example.ae');
  });

  it('keeps one character of a very short name', () => {
    expect(maskEmail('ab@example.ae')).toBe('a•@example.ae');
  });

  it('caps the number of masked characters', () => {
    expect(maskEmail(`${'a'.repeat(40)}@example.ae`)).toBe(`aa${'•'.repeat(11)}@example.ae`);
  });

  it('returns the input when it is not an email', () => {
    expect(maskEmail('not an email')).toBe('not an email');
  });
});
