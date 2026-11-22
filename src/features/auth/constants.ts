export const signInContent = {
  title: 'Welcome back',
  subtitle: 'Sign in to your GridX account.',
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  forgotPassword: 'Forgot password?',
  rememberMe: 'Remember me for 30 days',
  submit: 'Sign in',
  divider: 'or continue with',
  footerPrompt: 'Don’t have an account?',
  footerAction: 'Create account',
};

export const demoShortcut = {
  prompt: 'Demo shortcut:',
  action: 'Skip to portal',
};

/** Steps in the sign-up flow: account, verify email, KYC, smart meter. */
export const AUTH_TOTAL_STEPS = 4;

export const signUpContent = {
  title: 'Create your account',
  subtitle: 'Enter your email and choose a password.',
  emailLabel: 'Email address',
  emailPlaceholder: 'you@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Create a strong password',
  passwordHint: 'At least 8 characters, with a letter and a number.',
  confirmationLabel: 'Confirm password',
  confirmationPlaceholder: 'Re-enter your password',
  termsLabel:
    'I agree to the Terms of Service and Privacy Policy. I confirm I am 18 or over and a UAE resident.',
  termsPrefix: 'I agree to the ',
  termsLink: 'Terms of Service',
  termsJoin: ' and ',
  privacyLink: 'Privacy Policy',
  submit: 'Create account',
  divider: 'or continue with',
  footerPrompt: 'Already have an account?',
  footerAction: 'Sign in',
};

export const verifyEmailContent = {
  title: 'Verify your email',
  subtitlePrefix: 'We sent a 6-digit code to ',
  fallbackRecipient: 'your email address',
  hint: 'The code expires in 10 minutes. Check your spam folder if you don’t see it.',
  submit: 'Verify email',
  resendPrompt: 'Didn’t get a code?',
  resendAction: 'Resend code',
  resendNotice: 'A new code will be sent when email delivery is connected.',
  footerPrompt: 'Wrong email?',
  footerAction: 'Change email address',
};

export const KYC_MAX_FILE_SIZE_MB = 5;

export const KYC_ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'] as const;

export const kycContent = {
  title: 'Verify your identity',
  subtitle:
    'Required by Sri Lanka regulations before you can trade or use the wallet. Takes about 2 minutes.',
  fullNameLabel: 'Full legal name',
  fullNamePlaceholder: 'As shown on your NIC',
  nicLabel: 'NIC ID number',
  nicPlaceholder: '123456789V or 200012345678',
  dateOfBirthLabel: 'Date of birth',
  dateOfBirthPlaceholder: 'DD / MM / YYYY',
  nationalityLabel: 'Nationality',
  nationalityPlaceholder: 'Select',
  documentsLabel: 'Documents',
  documentsHint: `JPG, PNG or PDF · max ${KYC_MAX_FILE_SIZE_MB} MB`,
  browse: 'Browse',
  replace: 'Replace',
  submit: 'Submit for verification',
  skip: 'Skip for now, verify later in Settings',
};

export const KYC_DOCUMENTS = [
  { key: 'idFront', title: 'NIC ID — front', description: 'Name and ID number visible' },
  { key: 'idBack', title: 'NIC ID — back', description: 'Barcode side visible' },
  { key: 'selfie', title: 'Selfie holding your NIC ID', description: 'Face and ID both visible' },
] as const;

// TODO(api): load from the countries endpoint once it exists.
export const NATIONALITY_OPTIONS = [
  { label: 'Sri Lankan', value: 'LK' },
  { label: 'Indian', value: 'IN' },
  { label: 'Maldivian', value: 'MV' },
  { label: 'British', value: 'GB' },
  { label: 'Australian', value: 'AU' },
  { label: 'American', value: 'US' },
  { label: 'Other', value: 'OTHER' },
] as const;

export const smartMeterContent = {
  title: 'Connect your smart meter',
  subtitle:
    'Link your DEWA meter for real-time generation and usage data. You can also do this later in Settings.',
  meterTypeLabel: 'Meter type',
  serialLabel: 'Meter serial number',
  serialPlaceholder: 'e.g. DEWA-2024-XXXXXXXX',
  serialHint: 'Found on the front of your meter or in your DEWA account.',
  zoneLabel: 'Grid zone',
  zonePlaceholder: 'Select your zone',
  testTitle: 'Connection test',
  testDescription: 'Check your meter is reachable',
  testAction: 'Test',
  testNotice: 'Meter connection tests will be available when meter services are connected.',
  submit: 'Save and enter GridX',
  skip: 'Skip for now, connect meter later in Settings',
};

export const METER_TYPES = [
  { value: 'advanced', title: 'DEWA Advanced', description: 'Smart AMI meter', icon: 'speed' },
  { value: 'standard', title: 'DEWA Standard', description: 'Older digital meter', icon: 'plug' },
] as const;

// TODO(api): load the grid zones from the backend once the endpoint exists.
export const GRID_ZONE_OPTIONS = [
  { label: 'Zone A', value: 'A' },
  { label: 'Zone B', value: 'B' },
  { label: 'Zone C', value: 'C' },
  { label: 'Zone D', value: 'D' },
] as const;
