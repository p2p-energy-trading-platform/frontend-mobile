import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';

import { login, register, resendOtp, verifyEmail } from './api';
import { KYC_DOCUMENTS, kycContent, verifyEmailContent } from './constants';
import { getAuthErrorMessage } from './errors';
import { pickDocument } from './pick-document';
import { beginSession, saveSessionTokens } from './session';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // a ref blocks a second tap in the same frame, before `submitting` has re-rendered
  const submittingRef = useRef(false);

  // errors only show after the first submit attempt
  const errors = submitted ? getSignInErrors({ email, password }) : {};

  const signIn = async () => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      // `remember` is not sent: the gateway decides how long the refresh token lasts (30 days).
      const session = await login({ email: email.trim(), password });

      await beginSession(session);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign in failed', getAuthErrorMessage(error, 'signIn'));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(getSignInErrors({ email, password })).length > 0) return;

    void signIn();
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    remember,
    setRemember,
    errors,
    submitting,
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
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState<Partial<Record<SignUpField, boolean>>>({});

  const submittingRef = useRef(false);

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

  const signUp = async () => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);

    try {
      const trimmedEmail = email.trim();

      const account = await register({
        name: fullName.trim(),
        email: trimmedEmail,
        password,
      });

      // The account exists but is not verified yet. The tokens are kept for the KYC step, and
      // the user only enters the app at the end of the sign-up flow.
      await saveSessionTokens(account);

      router.push({ pathname: '/verify-email', params: { email: trimmedEmail } });
    } catch (error) {
      Alert.alert('Could not create account', getAuthErrorMessage(error, 'register'));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const submit = () => {
    setSubmitted(true);

    if (Object.keys(allErrors).length > 0) return;

    void signUp();
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
    submitting,
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
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const verifyingRef = useRef(false);
  const resendingRef = useRef(false);

  const codeValid = isValidOtp(code);

  const submitCode = async () => {
    if (verifyingRef.current) return;

    verifyingRef.current = true;
    setVerifying(true);

    try {
      const result = await verifyEmail({ email, otp: code });

      if (!result.success) {
        Alert.alert('Verification failed', result.message || 'That code is not valid.');
        return;
      }

      router.push('/kyc');
    } catch (error) {
      Alert.alert('Verification failed', getAuthErrorMessage(error, 'verifyEmail'));
    } finally {
      verifyingRef.current = false;
      setVerifying(false);
    }
  };

  const verify = () => {
    if (!codeValid || !email) return;

    void submitCode();
  };

  const sendNewCode = async () => {
    if (resendingRef.current) return;

    if (!email) {
      Alert.alert(verifyEmailContent.resendAction, 'Go back and enter your email address first.');
      return;
    }

    resendingRef.current = true;
    setResending(true);

    try {
      const result = await resendOtp(email);

      if (result.success) {
        Alert.alert(verifyEmailContent.resendAction, verifyEmailContent.resendNotice);
      } else {
        Alert.alert(verifyEmailContent.resendAction, 'We could not send a new code. Try again.');
      }
    } catch (error) {
      Alert.alert(verifyEmailContent.resendAction, getAuthErrorMessage(error, 'resendOtp'));
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  };

  const resend = () => {
    void sendNewCode();
  };

  return { email, code, setCode, codeValid, verifying, resending, verify, resend };
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
