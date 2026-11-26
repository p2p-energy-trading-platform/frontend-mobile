import {
  clearAuthTokens,
  clearPendingVerification,
  getPendingVerification,
  getRefreshToken,
  saveAuthTokens,
  savePendingVerification,
} from '@/lib/auth-token-store';
import { isEmailUnverified, useAppStore } from '@/store/app-store';

import * as authApi from './api';
import type { MeResponse, RegisterResponse, SessionTokensPayload } from './api';

/** `unverified` users have tokens but must verify their email before they enter the app. */
export type SessionState = 'active' | 'unverified' | 'signedOut';

/** Stores the tokens of a login / register response. Returns false when the response has none. */
export async function saveSessionTokens(payload: SessionTokensPayload): Promise<boolean> {
  if (!payload.accessToken || !payload.refreshToken) return false;

  await saveAuthTokens({ accessToken: payload.accessToken, refreshToken: payload.refreshToken });
  return true;
}

/** Stores the user's details. Only a user with a verified email is marked as signed in. */
async function applyUser(me: MeResponse): Promise<'active' | 'unverified'> {
  const unverified = isEmailUnverified(me);

  if (unverified) {
    await savePendingVerification({ userId: me.userId, email: me.email });
  } else {
    await clearPendingVerification();
  }

  const store = useAppStore.getState();

  store.setUser({
    userId: me.userId,
    email: me.email,
    name: me.name,
    role: me.role,
    status: me.status,
    ...(me.kycStatus ? { kycStatus: me.kycStatus } : {}),
  });
  store.setAuthenticated(!unverified);

  return unverified ? 'unverified' : 'active';
}

/** Keeps the new account's tokens for the rest of sign up. The user is not signed in yet. */
export async function beginSignUp(account: RegisterResponse): Promise<void> {
  if (!(await saveSessionTokens(account))) return;

  const { userId, email, status } = account;

  if (isEmailUnverified({ status })) {
    await savePendingVerification({ userId, email });
  }

  const store = useAppStore.getState();
  store.setUser({ userId, email, status });
  store.setAuthenticated(false);
}

/**
 * Starts a session from a login response: saves the tokens and loads the user.
 * Throws when the user cannot be loaded, because the email status is then unknown.
 */
export async function beginSession(
  payload: SessionTokensPayload,
): Promise<'active' | 'unverified'> {
  if (!(await saveSessionTokens(payload))) {
    throw new Error('The server did not return a session.');
  }

  try {
    return await applyUser(await authApi.getMe());
  } catch (error) {
    await clearAuthTokens();
    useAppStore.getState().clearSession();
    throw error;
  }
}

/** Call after the email is verified. */
export async function markEmailVerified(): Promise<void> {
  await clearPendingVerification();

  const { user, setUser } = useAppStore.getState();

  if (user) {
    const { status: _status, ...verifiedUser } = user;
    setUser(verifiedUser);
  }
}

/**
 * Loads the user from the stored tokens and updates the app state.
 * Used at app start and at the end of the sign-up flow.
 */
export async function restoreSession(): Promise<SessionState> {
  const store = useAppStore.getState();

  if (!(await getRefreshToken())) {
    store.clearSession();
    return 'signedOut';
  }

  try {
    // An expired access token is refreshed inside the API client.
    return await applyUser(await authApi.getMe());
  } catch {
    // The refresh token was revoked or expired: the client already cleared the tokens.
    if (!(await getRefreshToken())) {
      store.clearSession();
      return 'signedOut';
    }

    // Any other failure (offline, server down): use what is known on the device.
    const pending = await getPendingVerification();

    if (pending) {
      store.setUser({ ...pending, status: 'PENDING' });
      store.setAuthenticated(false);
      return 'unverified';
    }

    // Keep an already verified session usable offline, but never infer verification on a cold start.
    if (store.user && !isEmailUnverified(store.user)) {
      store.setAuthenticated(true);
      return 'active';
    }

    store.clearSession();
    return 'signedOut';
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
