import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'gridx.access-token';
const REFRESH_TOKEN_KEY = 'gridx.refresh-token';
const PENDING_VERIFICATION_KEY = 'gridx.pending-verification';
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

// Kept on the device so an unverified user is still blocked when the app restarts offline.
export async function savePendingVerification(pending: PendingVerification): Promise<void> {
  await SecureStore.setItemAsync(PENDING_VERIFICATION_KEY, JSON.stringify(pending));
}

export async function getPendingVerification(): Promise<PendingVerification | null> {
  const value = await SecureStore.getItemAsync(PENDING_VERIFICATION_KEY);

  return value ? (JSON.parse(value) as PendingVerification) : null;
}

export async function clearPendingVerification(): Promise<void> {
  await SecureStore.deleteItemAsync(PENDING_VERIFICATION_KEY);
}

export async function clearAuthTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    clearPendingVerification(),
  ]);
}
