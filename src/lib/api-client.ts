import { env } from '@/config/env';

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  type AuthTokens,
} from './auth-token-store';

type ApiErrorBody = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = RequestInit & {
  skipRefresh?: boolean;
  token?: string;
};

let refreshPromise: Promise<void> | undefined;

async function parseError(response: Response): Promise<ApiError> {
  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // Preserve the HTTP status when the gateway does not return JSON.
  }

  return new ApiError(
    response.status,
    body.error?.message ?? `Request failed with status ${response.status}`,
  );
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { skipRefresh = false, token, ...fetchOptions } = options;
  const accessToken = token ?? (await getAccessToken());
  const response = await fetch(`${env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '')}${path}`, {
    ...fetchOptions,
    headers: {
      ...(fetchOptions.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (response.ok) {
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  const error = await parseError(response);
  if (error.status !== 401 || skipRefresh || path === '/api/v1/auth/refresh') {
    throw error;
  }

  refreshPromise ??= refreshAccessToken().finally(() => {
    refreshPromise = undefined;
  });
  await refreshPromise;
  return request<T>(path, { ...options, skipRefresh: true });
}

async function refreshAccessToken(): Promise<void> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  const response = await fetch(
    `${env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '')}/api/v1/auth/refresh`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    },
  );

  if (!response.ok) {
    await clearAuthTokens();
    throw await parseError(response);
  }

  const tokens = (await response.json()) as Partial<AuthTokens>;
  if (!tokens.accessToken || !tokens.refreshToken) {
    throw new ApiError(502, 'The auth service did not return mobile tokens.');
  }
  await saveAuthTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  });
}

export function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(path, options);
}

export async function logout(): Promise<void> {
  const refreshToken = await getRefreshToken();
  try {
    await request<void>('/api/v1/auth/logout', {
      method: 'POST',
      token: refreshToken ?? undefined,
      skipRefresh: true,
    });
  } finally {
    await clearAuthTokens();
  }
}
