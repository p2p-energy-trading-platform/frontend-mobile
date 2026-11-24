import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import { useAppStore } from '@/store/app-store';

import { GoogleSignInError, signInWithGoogle } from './google-sign-in';

export function useGoogleSignIn() {
  const router = useRouter();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const [loading, setLoading] = useState(false);

  const signIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      // Closing the browser is a normal choice, not an error.
      if (result.status === 'cancelled') return;

      setAuthenticated(true);
      router.replace(result.isNewUser ? '/kyc' : '/(tabs)');
    } catch (error) {
      const message =
        error instanceof GoogleSignInError
          ? error.message
          : 'Google sign-in failed. Please try again.';
      Alert.alert('Google sign in', message);
    } finally {
      setLoading(false);
    }
  }, [loading, router, setAuthenticated]);

  return { signIn, loading };
}
