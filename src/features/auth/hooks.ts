import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { pickDocument } from './pick-document';
import type { KycDocumentKey, KycDocuments, KycErrors, MeterType, SignUpErrors } from './types';
import {
  formatDateInput,
  getDocumentError,
  getKycErrors,
  getSignInErrors,
  getSignUpErrors,
  isValidOtp,
  getSmartMeterErrors,
} from './utils';
import { useAppStore } from '@/store/app-store';

/** Sign-in form state, validation and submit. */
export function useSignIn() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // errors only show after the first submit attempt
  const errors = submitted ? getSignInErrors({ email, password }) : {};

  const enterApp = () => {
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(getSignInErrors({ email, password })).length > 0) return;

    // TODO(api): call POST /api/v1/auth/login, keep the session for 30 days when `remember`
    // is set, and show API errors before entering the app.
    enterApp();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    errors,
    submit,
  };
}

type SignUpField = 'email' | 'password' | 'confirmation';

/** Sign-up form state, validation and submit (step 1 of 4). */
export function useSignUp() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<SignUpField, boolean>>>({});

  const allErrors = getSignUpErrors({ email, password, confirmation, accepted });

  // a field shows its error after it was left once, or after the first submit attempt
  const showError = (field: SignUpField) => submitted || touched[field];

  const errors: SignUpErrors = {
    email: showError('email') ? allErrors.email : undefined,
    password: showError('password') ? allErrors.password : undefined,
    confirmation: showError('confirmation') ? allErrors.confirmation : undefined,
    terms: submitted ? allErrors.terms : undefined,
  };

  const touch = (field: SignUpField) => setTouched((prev) => ({ ...prev, [field]: true }));

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(allErrors).length > 0) return;

    // TODO(api): call POST /api/v1/auth/register with { email, password } first.
    router.push({ pathname: '/verify-email', params: { email: email.trim() } });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmation,
    setConfirmation,
    accepted,
    setAccepted,
    errors,
    touch,
    submit,
  };
}

/** Verify-email form state and submit (step 2 of 4). */
export function useVerifyEmail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const email = typeof params.email === 'string' ? params.email : '';
  const [code, setCode] = useState('');

  const codeValid = isValidOtp(code);

  const verify = () => {
    if (!codeValid) return;

    // TODO(api): call POST /api/v1/auth/verify-email with { email, otp: code } first.
    router.push('/kyc');
  };

  return { email, code, setCode, codeValid, verify };
}

type KycField = 'fullName' | 'nic' | 'dateOfBirth';

/** KYC form state, document picking, validation and submit (step 3 of 4). */
export function useKyc() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [dateOfBirth, setDateOfBirthValue] = useState('');
  const [nationality, setNationality] = useState('');
  const [documents, setDocuments] = useState<KycDocuments>({});
  const [documentErrors, setDocumentErrors] = useState<Partial<Record<KycDocumentKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<KycField, boolean>>>({});

  const allErrors = getKycErrors({ fullName, nic, dateOfBirth, nationality, documents });

  // a field shows its error after it was left once
  const showError = (field: KycField) => (touched[field] ? allErrors[field] : undefined);

  const errors: KycErrors = {
    fullName: showError('fullName'),
    nic: showError('nic'),
    dateOfBirth: showError('dateOfBirth'),
  };

  // the submit button stays disabled until everything is valid
  const canSubmit = Object.keys(allErrors).length === 0;

  const touch = (field: KycField) => setTouched((prev) => ({ ...prev, [field]: true }));

  const setDateOfBirth = (value: string) => setDateOfBirthValue(formatDateInput(value));

  const browse = async (key: KycDocumentKey) => {
    const picked = await pickDocument();
    if (!picked) return;

    const error = getDocumentError(picked);
    setDocumentErrors((prev) => ({ ...prev, [key]: error }));

    if (!error) {
      setDocuments((prev) => ({ ...prev, [key]: picked }));
    }
  };

  const submit = () => {
    if (!canSubmit) return;

    // TODO(api): upload the documents and call POST /api/v1/kyc with the form values first.
    router.push('/smart-meter');
  };

  const skip = () => router.push('/smart-meter');

  return {
    fullName,
    setFullName,
    nic,
    setNic: (value: string) => setNic(value.replace(/\s/g, '').toUpperCase()),
    dateOfBirth,
    setDateOfBirth,
    nationality,
    setNationality,
    documents,
    documentErrors,
    errors,
    canSubmit,
    touch,
    browse,
    submit,
    skip,
  };
}

/** Smart meter form state and submit (step 4 of 4). Ends the sign-up flow. */
export function useSmartMeter() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  const [meterType, setMeterType] = useState<MeterType>('advanced');
  const [serial, setSerialValue] = useState('');
  const [zone, setZone] = useState('');
  const [serialTouched, setSerialTouched] = useState(false);

  const allErrors = getSmartMeterErrors({ serial, zone });

  // the serial shows its error after it was left once
  const serialError = serialTouched ? allErrors.serial : undefined;

  // the submit button stays disabled until everything is valid
  const canSubmit = Object.keys(allErrors).length === 0;

  const enterApp = () => {
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  const submit = () => {
    if (!canSubmit) return;

    // TODO(api): call POST /api/v1/meters with { type, serial, zone } before entering the app.
    enterApp();
  };

  return {
    meterType,
    setMeterType,
    serial,
    setSerial: (value: string) => setSerialValue(value.toUpperCase()),
    touchSerial: () => setSerialTouched(true),
    serialError,
    zone,
    setZone,
    canSubmit,
    submit,
    skip: enterApp,
  };
}
