import * as SecureStore from 'expo-secure-store';

import { ApiError } from '@/lib/api-client';
import {
  getPendingVerification,
  getRefreshToken,
  getSessionUser,
  saveAuthTokens,
} from '@/lib/auth-token-store';
import { useAppStore } from '@/store/app-store';

import { getMe } from './api';
import {
  beginSession,
  beginSignUp,
  endSession,
  markEmailVerified,
  restoreSession,
} from './session';

jest.mock('./api', () => ({ getMe: jest.fn(), logout: jest.fn() }));

const TOKENS = { accessToken: 'access', refreshToken: 'refresh' };
const ACCOUNT = { userId: 'user-1', email: 'name@example.com' };

const me = (status: string) => ({ ...ACCOUNT, name: 'Jane Doe', role: 'PROSUMER', status });

describe('session', () => {
  it('signs in a verified user and loads their details', async () => {
    await saveAuthTokens(TOKENS);
    jest.mocked(getMe).mockResolvedValue(me('ACTIVE'));

    await expect(restoreSession()).resolves.toBe('active');

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(useAppStore.getState().user?.name).toBe('Jane Doe');
  });

  it('keeps an unverified user out of the app on restart', async () => {
    await saveAuthTokens(TOKENS);
    jest.mocked(getMe).mockResolvedValue(me('PENDING'));

    await expect(restoreSession()).resolves.toBe('unverified');

    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });

  it('still blocks an unverified user who restarts offline during sign up', async () => {
    await beginSignUp({ ...ACCOUNT, ...TOKENS, status: 'PENDING', createdAt: '' });
    useAppStore.getState().reset();
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await expect(restoreSession()).resolves.toBe('unverified');

    expect(useAppStore.getState().isAuthenticated).toBe(false);
    expect(useAppStore.getState().user?.email).toBe('name@example.com');
  });

  it('lets the user in offline once the email is verified', async () => {
    await beginSignUp({ ...ACCOUNT, ...TOKENS, status: 'PENDING', createdAt: '' });
    await markEmailVerified();
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await expect(restoreSession()).resolves.toBe('active');
    expect(await getPendingVerification()).toBeNull();
  });

  it('loads the full user profile when restoring after sign-up', async () => {
    await beginSignUp({ ...ACCOUNT, ...TOKENS, status: 'PENDING', createdAt: '' });
    jest.mocked(getMe).mockResolvedValue({
      ...me('ACTIVE'),
      kycStatus: 'PENDING',
    });

    await expect(restoreSession()).resolves.toBe('active');

    expect(useAppStore.getState().user).toEqual({
      ...me('ACTIVE'),
      kycStatus: 'PENDING',
    });
    expect(useAppStore.getState().isAuthenticated).toBe(true);
  });

  it('does not assume a cold-start session is verified when profile loading fails', async () => {
    await saveAuthTokens(TOKENS);
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await expect(restoreSession()).resolves.toBe('signedOut');

    expect(useAppStore.getState().isAuthenticated).toBe(false);
    expect(useAppStore.getState().user).toBeNull();
  });

  describe('offline cold start', () => {
    const offline = new ApiError('NETWORK', 'Could not reach GridX.');

    // a verified user signed in before, then the app was closed (memory is empty again)
    const signInThenRestart = async () => {
      await saveAuthTokens(TOKENS);
      jest.mocked(getMe).mockResolvedValueOnce(me('ACTIVE'));
      await restoreSession();
      useAppStore.getState().reset();
    };

    it('opens the app with the saved user when the server cannot be reached', async () => {
      await signInThenRestart();
      jest.mocked(getMe).mockRejectedValue(offline);

      await expect(restoreSession()).resolves.toBe('active');

      expect(useAppStore.getState().isAuthenticated).toBe(true);
      expect(useAppStore.getState().user?.name).toBe('Jane Doe');
    });

    it('also works when the server is down', async () => {
      await signInThenRestart();
      jest.mocked(getMe).mockRejectedValue(new ApiError('UPSTREAM_UNAVAILABLE', 'Down', 503));

      await expect(restoreSession()).resolves.toBe('active');
    });

    it('signs out when the server rejects the user', async () => {
      await signInThenRestart();
      jest.mocked(getMe).mockRejectedValue(new ApiError('FORBIDDEN', 'Account suspended', 403));

      await expect(restoreSession()).resolves.toBe('signedOut');

      expect(useAppStore.getState().isAuthenticated).toBe(false);
    });

    it('does not keep the saved user after sign out', async () => {
      await signInThenRestart();
      await endSession();

      expect(await getSessionUser()).toBeNull();
    });

    it('never saves an unverified user for offline starts', async () => {
      await saveAuthTokens(TOKENS);
      jest.mocked(getMe).mockResolvedValueOnce(me('PENDING'));
      await restoreSession();

      expect(await getSessionUser()).toBeNull();
    });

    it('ignores a broken saved value', async () => {
      await saveAuthTokens(TOKENS);
      await SecureStore.setItemAsync('gridx.session-user', '{not json');
      jest.mocked(getMe).mockRejectedValue(offline);

      await expect(restoreSession()).resolves.toBe('signedOut');
    });
  });

  it('does not sign in when the user cannot be loaded', async () => {
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await expect(beginSession(TOKENS)).rejects.toThrow('offline');

    expect(useAppStore.getState().isAuthenticated).toBe(false);
    expect(await getRefreshToken()).toBeNull();
  });
});
