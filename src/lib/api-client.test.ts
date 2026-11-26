import { getAccessToken, getRefreshToken, saveAuthTokens } from '@/lib/auth-token-store';

import { ApiError, apiRequest, setSessionExpiredHandler } from './api-client';

function jsonResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

const fetchMock = jest.fn();

describe('apiRequest', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    setSessionExpiredHandler(null);
  });

  it('sends the mobile header and the access token', async () => {
    await saveAuthTokens({ accessToken: 'access-1', refreshToken: 'refresh-1' });
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { userId: 'u1' }));

    await apiRequest('/api/v1/auth/me');

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://localhost:8000/api/v1/auth/me');
    expect(init.headers).toMatchObject({
      'X-Client-Type': 'mobile',
      Authorization: 'Bearer access-1',
    });
  });

  it('turns a gateway error body into an ApiError', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(409, { error: { code: 'CONFLICT', message: 'Taken.' } }),
    );

    await expect(
      apiRequest('/api/v1/auth/register', { method: 'POST', auth: false }),
    ).rejects.toMatchObject({ code: 'CONFLICT', message: 'Taken.', status: 409 });
  });

  it('reports a network failure as NETWORK', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(apiRequest('/api/v1/auth/me', { auth: false })).rejects.toMatchObject({
      code: 'NETWORK',
    });
  });

  it('refreshes once on a 401, stores the rotated tokens and retries', async () => {
    await saveAuthTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });

    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } }),
      )
      .mockResolvedValueOnce(
        jsonResponse(200, {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          expiresIn: 900,
        }),
      )
      .mockResolvedValueOnce(jsonResponse(200, { userId: 'u1' }));

    await expect(apiRequest('/api/v1/auth/me')).resolves.toEqual({ userId: 'u1' });

    const refreshCall = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(refreshCall[0]).toContain('/api/v1/auth/refresh');
    expect(refreshCall[1].body).toBe(JSON.stringify({ refreshToken: 'old-refresh' }));

    const retryCall = fetchMock.mock.calls[2] as [string, RequestInit];
    expect(retryCall[1].headers).toMatchObject({ Authorization: 'Bearer new-access' });

    expect(await getRefreshToken()).toBe('new-refresh');
  });

  it('shares one refresh between parallel requests', async () => {
    await saveAuthTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });

    fetchMock.mockImplementation(async (url: string, init: RequestInit) => {
      if (url.includes('/auth/refresh')) {
        return jsonResponse(200, {
          accessToken: 'new-access',
          refreshToken: 'new-refresh',
          expiresIn: 900,
        });
      }

      const bearer = (init.headers as Record<string, string>).Authorization;
      return bearer === 'Bearer new-access'
        ? jsonResponse(200, { ok: true })
        : jsonResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } });
    });

    await Promise.all([apiRequest('/api/v1/a'), apiRequest('/api/v1/b')]);

    const refreshCalls = fetchMock.mock.calls.filter(([url]) =>
      (url as string).includes('/auth/refresh'),
    );
    expect(refreshCalls).toHaveLength(1);
  });

  it('clears the tokens and signals expiry when the refresh token is rejected', async () => {
    const expired = jest.fn();
    setSessionExpiredHandler(expired);
    await saveAuthTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });

    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } }),
      )
      .mockResolvedValueOnce(
        jsonResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } }),
      );

    await expect(apiRequest('/api/v1/auth/me')).rejects.toBeInstanceOf(ApiError);

    expect(expired).toHaveBeenCalledTimes(1);
    expect(await getAccessToken()).toBeNull();
    expect(await getRefreshToken()).toBeNull();
  });

  it('keeps the tokens when the refresh fails because the server is down', async () => {
    const expired = jest.fn();
    setSessionExpiredHandler(expired);
    await saveAuthTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' });

    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } }),
      )
      .mockResolvedValueOnce(
        jsonResponse(503, { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'x' } }),
      );

    await expect(apiRequest('/api/v1/auth/me')).rejects.toMatchObject({ status: 503 });

    expect(expired).not.toHaveBeenCalled();
    expect(await getRefreshToken()).toBe('old-refresh');
  });
});