import { clearAuthTokens, getRefreshToken, saveAuthTokens } from '@/lib/auth-token-store';
import { useAppStore } from '@/store/app-store';

import * as authApi from './api';
import type { SessionTokensPayload } from './api';

/** Stores the tokens of a login / register response. Returns false when the response has none. */
export async function saveSessionTokens(payload: SessionTokensPayload): Promise<boolean> {
  if (!payload.accessToken || !payload.refreshToken) return false;

  await saveAuthTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  return true;
}

/** Fills in the name, role and KYC status. Best effort: the app works without it. */
export async function loadCurrentUser(): Promise<void> {
  try {
    const me = await authApi.getMe();

    useAppStore.getState().setUser({
      userId: me.userId,
      email: me.email,
      name: me.name,
      role: me.role,
      ...(me.kycStatus ? { kycStatus: me.kycStatus } : {}),
    });
  } catch {
    // keep the basic user from the login response
  }
}

/** Saves the tokens and marks the user as signed in. */
export async function beginSession(
  payload: SessionTokensPayload & { userId: string; email: string },
): Promise<void> {
  if (!(await saveSessionTokens(payload))) {
    throw new Error('The server did not return a session.');
  }

  const store = useAppStore.getState();
  store.setUser({ userId: payload.userId, email: payload.email });
  store.setAuthenticated(true);

  void loadCurrentUser();
}

/** Runs once at app start: signs the user in again from the stored tokens. */
export async function restoreSession(): Promise<void> {
  const store = useAppStore.getState();

  if (!(await getRefreshToken())) {
    store.clearSession();
    return;
  }

  try {
    // An expired access token is refreshed inside the API client.
    const me = await authApi.getMe();

    store.setUser({
      userId: me.userId,
      email: me.email,
      name: me.name,
      role: me.role,
      ...(me.kycStatus ? { kycStatus: me.kycStatus } : {}),
    });
    store.setAuthenticated(true);
  } catch {
    // The refresh token was revoked or expired: the client already cleared the tokens.
    // Any other failure (offline, server down): the tokens are still there, so stay signed in.
    if (await getRefreshToken()) {
      store.setAuthenticated(true);
    } else {
      store.clearSession();
    }
  }
}

/** Revokes the session on the server (best effort) and clears everything stored on the device. */
export async function endSession(): Promise<void> {
  const refreshToken = await getRefreshToken();

  try {
    if (refreshToken) await authApi.logout(refreshToken);
  } catch {
    // the user is signed out on this device either way
  }

  await clearAuthTokens();
  useAppStore.getState().clearSession();
}