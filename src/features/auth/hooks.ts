import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useAppStore } from '@/store/app-store';

import { getSignInErrors } from './utils';

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
    skipToPortal: enterApp,
  };
}
