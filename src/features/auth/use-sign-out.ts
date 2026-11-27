import { useRouter } from 'expo-router';
import { useCallback } from 'react';

import { endSession } from './session';

/** Returns a function that signs the user out and goes back to the splash screen. */
export function useSignOut() {
  const router = useRouter();

  return useCallback(async () => {
    await endSession();
    router.replace('/splash');
  }, [router]);
}
