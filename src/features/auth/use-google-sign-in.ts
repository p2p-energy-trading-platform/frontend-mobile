import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { GoogleSignInError, signInWithGoogle } from './google-sign-in';

export function useGoogleSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const signIn = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(undefined);

    try {
      const result = await signInWithGoogle();

      // Closing the browser is a normal choice, not an error.
      if (result.status === 'cancelled') return;

      if (result.status === 'unverified') {
        router.replace({ pathname: '/verify-email', params: { email: result.email } });
        return;
      }

      router.replace(result.isNewUser ? '/kyc' : '/(tabs)');
    } catch (caught) {
      setError(
        caught instanceof GoogleSignInError
          ? caught.message
          : 'Google sign-in failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }, [loading, router]);

  return { signIn, loading, error };
}
