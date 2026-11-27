import * as SecureStore from 'expo-secure-store';

import type { SessionUser } from '@/store/app-store';

const ACCESS_TOKEN_KEY = 'gridx.access-token';
const REFRESH_TOKEN_KEY = 'gridx.refresh-token';
const PENDING_VERIFICATION_KEY = 'gridx.pending-verification';
const SESSION_USER_KEY = 'gridx.session-user';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export async function saveAuthTokens(tokens: AuthTokens): Promise<void> {
  await Promise.all([
    SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken),
    SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken),
  ]);
}

/** A signed-in account that still has to verify its email. */
export type PendingVerification = {
  userId: string;
  email: string;
};

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function getRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

/** Reads a JSON value. A broken value is removed and treated as missing. */
async function readJson<T>(key: string): Promise<T | null> {
  const value = await SecureStore.getItemAsync(key);

  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    await SecureStore.deleteItemAsync(key);
    return null;
  }
}

// Kept on the device so an unverified user is still blocked when the app restarts offline.
export async function savePendingVerification(pending: PendingVerification): Promise<void> {
  await SecureStore.setItemAsync(PENDING_VERIFICATION_KEY, JSON.stringify(pending));
}

export async function getPendingVerification(): Promise<PendingVerification | null> {
  return readJson<PendingVerification>(PENDING_VERIFICATION_KEY);
}

export async function clearPendingVerification(): Promise<void> {
  await SecureStore.deleteItemAsync(PENDING_VERIFICATION_KEY);
}

export async function saveSessionUser(user: SessionUser): Promise<void> {
  await SecureStore.setItemAsync(SESSION_USER_KEY, JSON.stringify(user));
}

export async function getSessionUser(): Promise<SessionUser | null> {
  return readJson<SessionUser>(SESSION_USER_KEY);
}

export async function clearSessionUser(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_USER_KEY);
}

export async function clearAuthTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    clearPendingVerification(),
    clearSessionUser(),
  ]);
}
