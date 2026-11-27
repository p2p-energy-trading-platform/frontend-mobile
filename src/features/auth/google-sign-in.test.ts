import * as WebBrowser from 'expo-web-browser';

import { getAccessToken, getRefreshToken } from '@/lib/auth-token-store';
import { useAppStore } from '@/store/app-store';

import {
  createCodeChallenge,
  createCodeVerifier,
  GoogleSignInError,
  parseGoogleRedirect,
  signInWithGoogle,
} from './google-sign-in';

const REDIRECT = 'gridx://auth/google';

// Node's crypto, typed locally: the app's tsconfig has no Node types.
type NodeCrypto = {
  randomBytes: (size: number) => Uint8Array;
  createHash: (algorithm: 'sha256') => {
    update: (data: string) => { digest: (encoding: 'base64' | 'base64url') => string };
  };
};

function sha256(data: string, encoding: 'base64' | 'base64url'): string {
  const nodeCrypto = jest.requireActual<NodeCrypto>('crypto');
  return nodeCrypto.createHash('sha256').update(data).digest(encoding);
}

function browserResult(result: { type: string; url?: string }) {
  return result as WebBrowser.WebBrowserAuthSessionResult;
}

jest.mock('@/config/env', () => ({
  env: { EXPO_PUBLIC_API_BASE_URL: 'http://localhost:8000/' },
}));

jest.mock('expo-crypto', () => {
  const nodeCrypto = jest.requireActual<NodeCrypto>('crypto');

  return {
    CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
    CryptoEncoding: { BASE64: 'base64' },
    getRandomBytes: jest.fn((count: number) => new Uint8Array(nodeCrypto.randomBytes(count))),
    // The real SHA-256, so the base64 → base64url conversion is checked for real.
    digestStringAsync: jest.fn(async (_algorithm: string, data: string) =>
      nodeCrypto.createHash('sha256').update(data).digest('base64'),
    ),
  };
});

jest.mock('expo-linking', () => ({ createURL: jest.fn(() => 'gridx://auth/google') }));

jest.mock('expo-web-browser', () => ({ openAuthSessionAsync: jest.fn() }));

const openAuthSession = WebBrowser.openAuthSessionAsync as jest.MockedFunction<
  typeof WebBrowser.openAuthSessionAsync
>;

const SESSION = {
  userId: 'user-1',
  email: 'user@gmail.com',
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  expiresIn: 900,
  isNewUser: false,
};

type MockResponse = { ok: boolean; status?: number; body?: unknown };

function mockFetch(responses: MockResponse | MockResponse[] | Error) {
  const queue = Array.isArray(responses) ? responses : [responses];
  let index = 0;
  const fetchMock = jest.fn(async (_input: RequestInfo | URL, _init?: RequestInit) => {
    const response = queue[index++];

    if (!response) throw new Error('Unexpected API request in Google sign-in test.');

    if (response instanceof Error) throw response;
    return {
      ok: response.ok,
      status: response.status ?? (response.ok ? 200 : 401),
      json: async () => response.body,
    } as Response;
  });
  globalThis.fetch = fetchMock;
  return fetchMock;
}

describe('PKCE helpers', () => {
  it('creates a verifier the gateway accepts', () => {
    const verifier = createCodeVerifier();

    expect(verifier).toMatch(/^[A-Za-z0-9._~-]{43,128}$/);
    expect(createCodeVerifier()).not.toBe(verifier);
  });

  it('creates the base64url SHA-256 challenge for a verifier', async () => {
    const verifier = createCodeVerifier();

    const challenge = await createCodeChallenge(verifier);

    expect(challenge).toBe(sha256(verifier, 'base64url'));
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});

describe('parseGoogleRedirect', () => {
  it('reads the handoff code', () => {
    expect(parseGoogleRedirect(`${REDIRECT}?handoff=abc123`)).toEqual({ handoff: 'abc123' });
  });

  it('reads the handoff code from an Expo Go link', () => {
    expect(parseGoogleRedirect('exp://127.0.0.1:8081/--/auth/google?handoff=abc123')).toEqual({
      handoff: 'abc123',
    });
  });

  it('reads a failure', () => {
    expect(parseGoogleRedirect(`${REDIRECT}?error=google`)).toEqual({ error: 'google' });
  });

  it('returns nothing for a bare link', () => {
    expect(parseGoogleRedirect(REDIRECT)).toEqual({});
  });
});

describe('signInWithGoogle', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  it('opens the gateway start URL with a PKCE challenge and the app redirect', async () => {
    openAuthSession.mockResolvedValue(browserResult({ type: 'cancel' }));

    await signInWithGoogle();

    const [startUrl, redirect] = openAuthSession.mock.calls[0] ?? [];
    expect(startUrl).toMatch(
      /^http:\/\/localhost:8000\/api\/v1\/auth\/google\/start\?client=mobile&codeChallenge=[A-Za-z0-9_-]{43}$/,
    );
    expect(redirect).toBe(REDIRECT);
  });

  it('exchanges the handoff with the matching verifier and saves the tokens', async () => {
    openAuthSession.mockResolvedValue(
      browserResult({ type: 'success', url: `${REDIRECT}?handoff=handoff-1` }),
    );
    const fetchMock = mockFetch([
      { ok: true, body: { ...SESSION, isNewUser: true } },
      {
        ok: true,
        body: {
          userId: 'user-1',
          email: 'user@gmail.com',
          name: 'Google User',
          role: 'PROSUMER',
          status: 'ACTIVE',
        },
      },
    ]);

    const result = await signInWithGoogle();

    expect(result).toEqual({ status: 'success', isNewUser: true });

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('http://localhost:8000/api/v1/auth/google/mobile/exchange');
    expect(init.headers).toMatchObject({ 'X-Client-Type': 'mobile' });
    expect(fetchMock.mock.calls[1]?.[0]).toBe('http://localhost:8000/api/v1/auth/me');

    // The verifier sent must be the one behind the challenge sent to /start.
    const { handoff, codeVerifier } = JSON.parse(String(init.body)) as {
      handoff: string;
      codeVerifier: string;
    };
    const challenge = new URL(String(openAuthSession.mock.calls[0]?.[0])).searchParams.get(
      'codeChallenge',
    );
    expect(handoff).toBe('handoff-1');
    expect(sha256(codeVerifier, 'base64url')).toBe(challenge);

    expect(await getAccessToken()).toBe('access-token');
    expect(await getRefreshToken()).toBe('refresh-token');
    expect(useAppStore.getState().user?.name).toBe('Google User');
  });

  it('loads the Google user and reports unverified accounts for email verification', async () => {
    openAuthSession.mockResolvedValue(
      browserResult({ type: 'success', url: `${REDIRECT}?handoff=handoff-1` }),
    );
    mockFetch([
      { ok: true, body: { ...SESSION, isNewUser: false } },
      {
        ok: true,
        body: {
          userId: 'user-1',
          email: 'user@gmail.com',
          name: 'Google User',
          role: 'PROSUMER',
          status: 'PENDING',
        },
      },
    ]);

    await expect(signInWithGoogle()).resolves.toEqual({
      status: 'unverified',
      email: 'user@gmail.com',
    });
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });

  it.each(['cancel', 'dismiss'] as const)(
    'returns cancelled when the browser is closed (%s)',
    async (type) => {
      openAuthSession.mockResolvedValue(browserResult({ type }));
      const fetchMock = mockFetch({ ok: true, body: SESSION });

      expect(await signInWithGoogle()).toEqual({ status: 'cancelled' });
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('fails when the gateway redirects back with an error', async () => {
    openAuthSession.mockResolvedValue(
      browserResult({ type: 'success', url: `${REDIRECT}?error=google` }),
    );
    const fetchMock = mockFetch({ ok: true, body: SESSION });

    await expect(signInWithGoogle()).rejects.toBeInstanceOf(GoogleSignInError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails without saving tokens when the exchange is rejected', async () => {
    openAuthSession.mockResolvedValue(
      browserResult({ type: 'success', url: `${REDIRECT}?handoff=handoff-1` }),
    );
    mockFetch({ ok: false, status: 401, body: { error: { code: 'UNAUTHENTICATED' } } });

    await expect(signInWithGoogle()).rejects.toBeInstanceOf(GoogleSignInError);
    expect(await getAccessToken()).toBeNull();
  });

  it('fails with a connection message when the gateway is unreachable', async () => {
    openAuthSession.mockResolvedValue(
      browserResult({ type: 'success', url: `${REDIRECT}?handoff=handoff-1` }),
    );
    mockFetch(new TypeError('Network request failed'));

    await expect(signInWithGoogle()).rejects.toThrow(/Could not reach GridX/);
  });
});
