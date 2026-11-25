import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { KYC_DOCUMENTS, kycContent } from './constants';
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

type SignUpField = 'fullName' | 'email' | 'password' | 'confirmation';

/** Sign-up form state, validation and submit (step 1 of 4). */
export function useSignUp() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<SignUpField, boolean>>>({});

  const allErrors = getSignUpErrors({ fullName, email, password, confirmation, accepted });

  // a field shows its error after it was left once, or after the first submit attempt
  const showError = (field: SignUpField) => submitted || touched[field];

  const errors: SignUpErrors = {
    fullName: showError('fullName') ? allErrors.fullName : undefined,
    email: showError('email') ? allErrors.email : undefined,
    password: showError('password') ? allErrors.password : undefined,
    confirmation: showError('confirmation') ? allErrors.confirmation : undefined,
    terms: submitted ? allErrors.terms : undefined,
  };

  const touch = (field: SignUpField) => setTouched((prev) => ({ ...prev, [field]: true }));

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(allErrors).length > 0) return;

    // TODO(api): call POST /api/v1/auth/register with { fullName: fullName.trim(), email, password } first.
    router.push({ pathname: '/verify-email', params: { email: email.trim() } });
  };

  return {
    fullName,
    setFullName,
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
  const [pickErrors, setPickErrors] = useState<Partial<Record<KycDocumentKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<KycField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [picking, setPicking] = useState(false);

  // a ref blocks a second tap in the same frame, before `picking` has re-rendered
  const pickingRef = useRef(false);

  const allErrors = getKycErrors({ fullName, nic, dateOfBirth, nationality, documents });

  // a field shows its error after it was left once, or after the first submit attempt
  const showError = (field: KycField) =>
    submitted || touched[field] ? allErrors[field] : undefined;

  const errors: KycErrors = {
    fullName: showError('fullName'),
    nic: showError('nic'),
    dateOfBirth: showError('dateOfBirth'),
    nationality: submitted ? allErrors.nationality : undefined,
  };

  const documentErrors = Object.fromEntries(
    KYC_DOCUMENTS.map(({ key }) => [
      key,
      pickErrors[key] ?? (submitted && !documents[key] ? kycContent.documentRequired : undefined),
    ]),
  ) as Partial<Record<KycDocumentKey, string>>;

  const touch = (field: KycField) => setTouched((prev) => ({ ...prev, [field]: true }));

  const setDateOfBirth = (value: string) => setDateOfBirthValue(formatDateInput(value));

  const browse = async (key: KycDocumentKey) => {
    // only one picker can be open at a time
    if (pickingRef.current) return;

    pickingRef.current = true;
    setPicking(true);

    try {
      const { document, error: pickerError } = await pickDocument();

      if (pickerError) {
        setPickErrors((prev) => ({ ...prev, [key]: pickerError }));
        return;
      }

      // the user cancelled
      if (!document) return;

      const error = getDocumentError(document);
      setPickErrors((prev) => ({ ...prev, [key]: error }));

      if (!error) {
        setDocuments((prev) => ({ ...prev, [key]: document }));
      }
    } finally {
      pickingRef.current = false;
      setPicking(false);
    }
  };

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(allErrors).length > 0) return;

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
    picking,
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
