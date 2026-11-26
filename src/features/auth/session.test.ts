import { getPendingVerification, getRefreshToken, saveAuthTokens } from '@/lib/auth-token-store';
import { useAppStore } from '@/store/app-store';

import { getMe } from './api';
import { beginSession, beginSignUp, markEmailVerified, restoreSession } from './session';

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

  it('does not sign in when the user cannot be loaded', async () => {
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await expect(beginSession(TOKENS)).rejects.toThrow('offline');

    expect(useAppStore.getState().isAuthenticated).toBe(false);
    expect(await getRefreshToken()).toBeNull();
  });
});
