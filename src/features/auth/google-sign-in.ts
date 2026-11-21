import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { env } from '@/config/env';
import { saveAuthTokens } from '@/lib/auth-token-store';

const REDIRECT_PATH = 'auth/google';

const VERIFIER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const VERIFIER_LENGTH = 64;

export type GoogleSignInResult =
  { status: 'success'; isNewUser: boolean } | { status: 'cancelled' };

export class GoogleSignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleSignInError';
  }
}

type ExchangeResponse = {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  isNewUser: boolean;
};

export function googleRedirectUri(): string {
  return Linking.createURL(REDIRECT_PATH);
}

export function createCodeVerifier(): string {
  const bytes = Crypto.getRandomBytes(VERIFIER_LENGTH);
  return Array.from(bytes, (byte) => VERIFIER_ALPHABET[byte & 63]).join('');
}

/** base64url(sha256(verifier)), as the gateway expects (RFC 7636 S256). */
export async function createCodeChallenge(verifier: string): Promise<string> {
  const base64 = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, verifier, {
    encoding: Crypto.CryptoEncoding.BASE64,
  });

  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function parseGoogleRedirect(url: string): { handoff?: string; error?: string } {
  const handoff = queryParam(url, 'handoff');
  const error = queryParam(url, 'error');

  return {
    ...(handoff ? { handoff } : {}),
    ...(error ? { error } : {}),
  };
}

// React Native's URL has no searchParams, so read the query string directly.
function queryParam(url: string, name: string): string | undefined {
  const query = url.split('#')[0]?.split('?')[1] ?? '';

  for (const pair of query.split('&')) {
    const [key, value = ''] = pair.split('=');
    if (key === name) {
      try {
        return decodeURIComponent(value.replace(/\+/g, ' '));
      } catch {
        return undefined;
      }
    }
  }

  return undefined;
}

function apiUrl(path: string): string {
  return `${env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function exchangeHandoff(handoff: string, codeVerifier: string): Promise<ExchangeResponse> {
  let response: Response;
  try {
    response = await fetch(apiUrl('/api/v1/auth/google/mobile/exchange'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Client-Type': 'mobile' },
      body: JSON.stringify({ handoff, codeVerifier }),
    });
  } catch {
    throw new GoogleSignInError('Could not reach GridX. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new GoogleSignInError('Google sign-in could not be completed. Please try again.');
  }

  return (await response.json()) as ExchangeResponse;
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const redirectUri = googleRedirectUri();

  if (__DEV__) {
    // eslint-disable-next-line no-console -- development-only setup hint
    console.log(`[google-sign-in] redirect URI: ${redirectUri}`);
  }

  const codeVerifier = createCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);
  const startUrl = apiUrl(
    `/api/v1/auth/google/start?client=mobile&codeChallenge=${encodeURIComponent(codeChallenge)}`,
  );

  const result = await WebBrowser.openAuthSessionAsync(startUrl, redirectUri);

  if (result.type !== 'success') {
    return { status: 'cancelled' };
  }

  const { handoff, error } = parseGoogleRedirect(result.url);

  if (error !== undefined || handoff === undefined) {
    throw new GoogleSignInError('Google sign-in failed. Please try again.');
  }

  const session = await exchangeHandoff(handoff, codeVerifier);
  await saveAuthTokens({ accessToken: session.accessToken, refreshToken: session.refreshToken });

  return { status: 'success', isNewUser: session.isNewUser };
}
