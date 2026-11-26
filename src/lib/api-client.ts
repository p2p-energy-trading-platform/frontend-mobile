import { env } from '@/config/env';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from '@/lib/auth-token-store';

const REQUEST_TIMEOUT_MS = 15_000;

const REFRESH_PATH = '/api/v1/auth/refresh';

type GatewayErrorBody = {
  error?: { code?: string; message?: string; details?: unknown[] };
};

export class ApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = 0,
    readonly details: unknown[] = [],
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Send the access token and refresh it once on a 401. Turn off for public endpoints. */
  auth?: boolean;
};

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

function apiUrl(path: string): string {
  return `${env.EXPO_PUBLIC_API_BASE_URL.replace(/\/$/, '')}${path}`;
}

async function send(
  path: string,
  method: string,
  body: unknown,
  accessToken: string | null,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(apiUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        'X-Client-Type': 'mobile',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new ApiError('TIMEOUT', 'The request took too long. Please try again.');
    }

    throw new ApiError('NETWORK', 'Could not reach GridX. Check your connection and try again.');
  } finally {
    clearTimeout(timer);
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  let body: GatewayErrorBody = {};

  try {
    body = (await response.json()) as GatewayErrorBody;
  } catch {

  }

  return new ApiError(
    body.error?.code ?? 'UNKNOWN',
    body.error?.message ?? 'Something went wrong. Please try again.',
    response.status,
    body.error?.details ?? [],
  );
}

async function parse<T>(response: Response): Promise<T> {
  if (!response.ok) throw await toApiError(response);

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

type RefreshResponse = { accessToken: string; refreshToken: string; expiresIn: number };

async function runRefresh(): Promise<boolean> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) return false;

  const response = await send(REFRESH_PATH, 'POST', { refreshToken }, null);

  if (response.ok) {
    const tokens = (await response.json()) as RefreshResponse;
    await saveAuthTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    return true;
  }

  if (response.status === 429 || response.status >= 500) throw await toApiError(response);

  await clearAuthTokens();
  return false;
}

let refreshing: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  refreshing ??= runRefresh().finally(() => {
    refreshing = null;
  });

  return refreshing;
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const first = await send(path, method, body, auth ? await getAccessToken() : null);

  if (first.status !== 401 || !auth) return parse<T>(first);

  if (!(await refreshSession())) {
    onSessionExpired?.();
    return parse<T>(first);
  }

  const retry = await send(path, method, body, await getAccessToken());

  if (retry.status === 401) {
    await clearAuthTokens();
    onSessionExpired?.();
  }

  return parse<T>(retry);
}