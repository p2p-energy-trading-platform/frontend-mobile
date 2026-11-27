import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { env } from '@/config/env';
import { ApiError } from '@/lib/api-client';

import { exchangeGoogleHandoff } from './api';
import { beginSession } from './session';

const REDIRECT_PATH = 'auth/google';

const VERIFIER_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const VERIFIER_LENGTH = 64;

export type GoogleSignInResult =
  | { status: 'success'; isNewUser: boolean }
  | { status: 'unverified'; email: string }
  | { status: 'cancelled' };

export class GoogleSignInError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GoogleSignInError';
  }
}

/** Swaps the handoff code for tokens, then starts the session like an email sign in. */
async function completeSignIn(handoff: string, codeVerifier: string) {
  try {
    const session = await exchangeGoogleHandoff({ handoff, codeVerifier });

    return { session, state: await beginSession(session) };
  } catch (error) {
    if (error instanceof ApiError && (error.code === 'NETWORK' || error.code === 'TIMEOUT')) {
      throw new GoogleSignInError(error.message);
    }

    throw new GoogleSignInError('Google sign-in could not be completed. Please try again.');
  }
}

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

  const { session, state } = await completeSignIn(handoff, codeVerifier);

  if (state === 'unverified') {
    return { status: 'unverified', email: session.email };
  }

  return { status: 'success', isNewUser: session.isNewUser };
}
