import { useEffect } from 'react';

import { setSessionExpiredHandler } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';

import { restoreSession } from './session';

/** Restores the saved session once at app start. Returns true when the first check is done. */
export function useSessionBootstrap(): boolean {
  const initialized = useAppStore((state) => state.initialized);

  useEffect(() => {
    // The tab layout redirects to /splash as soon as the user is no longer authenticated.
    setSessionExpiredHandler(() => useAppStore.getState().clearSession());

    let active = true;

    void restoreSession().finally(() => {
      if (active) useAppStore.getState().setInitialized(true);
    });

    return () => {
      active = false;
      setSessionExpiredHandler(null);
    };
  }, []);

  return initialized;
}