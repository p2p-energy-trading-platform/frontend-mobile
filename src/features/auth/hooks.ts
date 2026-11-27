import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';

import { login, register, resendOtp, verifyEmail } from './api';
import {
  KYC_DOCUMENTS,
  RESEND_COOLDOWN_SECONDS,
  kycContent,
  verifyEmailContent,
} from './constants';
import { getAuthErrorMessage } from './errors';
import { KycUploadError, submitKycWithDocument } from './kyc-api';
import { pickDocument } from './pick-document';
import { beginSession, beginSignUp, markEmailVerified, restoreSession } from './session';
import type {
  KycDocumentKey,
  KycDocuments,
  KycErrors,
  MeterType,
  PickedDocument,
  SignUpErrors,
} from './types';
import { useCountdown } from './components/use-countdown';
import {
  formatDateInput,
  getDocumentError,
  getKycErrors,
  getSignInErrors,
  getSignUpErrors,
  isValidOtp,
  getSmartMeterErrors,
  toIsoDate,
} from './utils';
import { ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';

/** Sign-in form state, validation and submit. */
export function useSignIn() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();

  // a ref blocks a second tap in the same frame, before `submitting` has re-rendered
  const submittingRef = useRef(false);

  // errors only show after the first submit attempt
  const errors = submitted ? getSignInErrors({ email, password }) : {};

  const signIn = async () => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setFormError(undefined);

    try {
      const trimmedEmail = email.trim();
      const session = await login({ email: trimmedEmail, password });

      if ((await beginSession(session)) === 'unverified') {
        router.replace({ pathname: '/verify-email', params: { email: trimmedEmail } });
        return;
      }

      router.replace('/(tabs)');
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'signIn'));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // an old error is hidden as soon as the user edits the form
  const clearingError = (setValue: (value: string) => void) => (value: string) => {
    setFormError(undefined);
    setValue(value);
  };

  const submit = () => {
    setSubmitted(true);
    setFormError(undefined);

    if (Object.keys(getSignInErrors({ email, password })).length > 0) return;

    void signIn();
  };

  return {
    email,
    setEmail: clearingError(setEmail),
    password,
    setPassword: clearingError(setPassword),
    errors,
    formError,
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
  const [formError, setFormError] = useState<string>();

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
    setFormError(undefined);

    try {
      const trimmedEmail = email.trim();

      const account = await register({
        name: fullName.trim(),
        email: trimmedEmail,
        password,
      });

      // The account exists but is not verified yet. The tokens are kept for the KYC step, and
      // the user only enters the app at the end of the sign-up flow.
      await beginSignUp(account);

      router.push({ pathname: '/verify-email', params: { email: trimmedEmail } });
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'register'));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  // an old error is hidden as soon as the user edits the form
  const clearingError = (setValue: (value: string) => void) => (value: string) => {
    setFormError(undefined);
    setValue(value);
  };

  const submit = () => {
    setSubmitted(true);
    setFormError(undefined);

    if (Object.keys(allErrors).length > 0) return;

    void signUp();
  };

  return {
    fullName,
    setFullName: clearingError(setFullName),
    email,
    setEmail: clearingError(setEmail),
    password,
    setPassword: clearingError(setPassword),
    confirmation,
    setConfirmation: clearingError(setConfirmation),
    accepted,
    setAccepted,
    errors,
    formError,
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
  const [code, setCodeValue] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const { secondsLeft: resendSecondsLeft, start: startResendCooldown } = useCountdown();

  const verifyingRef = useRef(false);
  const resendingRef = useRef(false);

  const codeValid = isValidOtp(code);

  const clearMessages = () => {
    setFormError(undefined);
    setNotice(undefined);
  };

  const setCode = (value: string) => {
    clearMessages();
    setCodeValue(value);
  };

  const submitCode = async () => {
    if (verifyingRef.current) return;

    verifyingRef.current = true;
    setVerifying(true);
    clearMessages();

    try {
      const result = await verifyEmail({ email, otp: code });

      if (!result.success) {
        setFormError(result.message || 'That code is not valid.');
        return;
      }

      await markEmailVerified();
      router.push('/kyc');
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'verifyEmail'));
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
    if (resendingRef.current || resendSecondsLeft > 0) return;

    clearMessages();

    if (!email) {
      setFormError('Go back and enter your email address first.');
      return;
    }

    resendingRef.current = true;
    setResending(true);

    try {
      const result = await resendOtp(email);

      if (result.success) {
        setNotice(verifyEmailContent.resendNotice);
        startResendCooldown(RESEND_COOLDOWN_SECONDS);
      } else {
        setFormError('We could not send a new code. Try again.');
      }
    } catch (error) {
      setFormError(getAuthErrorMessage(error, 'resendOtp'));

      if (error instanceof ApiError && error.code === 'RATE_LIMITED') {
        startResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } finally {
      resendingRef.current = false;
      setResending(false);
    }
  };

  const resend = () => {
    void sendNewCode();
  };

  return {
    email,
    code,
    setCode,
    codeValid,
    verifying,
    resending,
    resendSecondsLeft,
    formError,
    notice,
    verify,
    resend,
  };
}

type KycField = 'fullName' | 'nic' | 'dateOfBirth';

/** KYC form state, document picking, validation and submit (step 3 of 4). */
export function useKyc() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [dateOfBirth, setDateOfBirthValue] = useState('');
  const [documents, setDocuments] = useState<KycDocuments>({});
  const [pickErrors, setPickErrors] = useState<Partial<Record<KycDocumentKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<KycField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();

  // a ref blocks a second tap in the same frame, before `picking` has re-rendered
  const pickingRef = useRef(false);
  const submittingRef = useRef(false);

  const allErrors = getKycErrors({ fullName, nic, dateOfBirth, documents });

  // a field shows its error after it was left once, or after the first submit attempt
  const showError = (field: KycField) =>
    submitted || touched[field] ? allErrors[field] : undefined;

  const errors: KycErrors = {
    fullName: showError('fullName'),
    nic: showError('nic'),
    dateOfBirth: showError('dateOfBirth'),
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

  const sendKyc = async (document: PickedDocument, isoDateOfBirth: string) => {
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setFormError(undefined);

    try {
      const submission = await submitKycWithDocument(
        { fullName: fullName.trim(), nicNumber: nic, dateOfBirth: isoDateOfBirth },
        document,
      );

      const { user, setUser } = useAppStore.getState();
      if (user) setUser({ ...user, kycStatus: submission.state });

      router.push('/smart-meter');
    } catch (error) {
      setFormError(
        error instanceof KycUploadError
          ? kycContent.uploadError
          : getAuthErrorMessage(error, 'submitKyc'),
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  const submit = () => {
    setSubmitted(true);
    setFormError(undefined);

    const isoDateOfBirth = toIsoDate(dateOfBirth);

    if (Object.keys(allErrors).length > 0 || !documents.nic || !isoDateOfBirth) return;

    void sendKyc(documents.nic, isoDateOfBirth);
  };

  const skip = () => router.push('/smart-meter');

  return {
    fullName,
    setFullName,
    nic,
    setNic: (value: string) => setNic(value.replace(/\s/g, '').toUpperCase()),
    dateOfBirth,
    setDateOfBirth,
    documents,
    documentErrors,
    errors,
    picking,
    submitting,
    formError,
    touch,
    browse,
    submit,
    skip,
  };
}

/** Smart meter form state and submit (step 4 of 4). Ends the sign-up flow. */
export function useSmartMeter() {
  const router = useRouter();

  const [meterType, setMeterType] = useState<MeterType>('advanced');
  const [serial, setSerialValue] = useState('');
  const [zone, setZone] = useState('');
  const [serialTouched, setSerialTouched] = useState(false);
  const [entering, setEntering] = useState(false);

  const enteringRef = useRef(false);

  const allErrors = getSmartMeterErrors({ serial, zone });

  // the serial shows its error after it was left once
  const serialError = serialTouched ? allErrors.serial : undefined;

  // the submit button stays disabled until everything is valid
  const canSubmit = Object.keys(allErrors).length === 0;

  const finishSignUp = async () => {
    if (enteringRef.current) return;

    enteringRef.current = true;
    setEntering(true);

    try {
      // loads the user's details and marks them as signed in
      const state = await restoreSession();

      if (state === 'active') {
        router.replace('/(tabs)');
      } else if (state === 'unverified') {
        const email = useAppStore.getState().user?.email ?? '';
        router.replace({ pathname: '/verify-email', params: { email } });
      } else {
        router.replace('/sign-in');
      }
    } finally {
      enteringRef.current = false;
      setEntering(false);
    }
  };

  const enterApp = () => {
    void finishSignUp();
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
    entering,
    submit,
    skip: enterApp,
  };
}
