import { apiRequest } from '@/lib/api-client';
import type { SessionUser } from '@/store/app-store';

/** Tokens come back in the JSON body because the app sends `X-Client-Type: mobile`. */
export type SessionTokensPayload = {
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

export type LoginResponse = SessionTokensPayload & {
  userId: string;
  email: string;
};

export type RegisterResponse = LoginResponse & {
  status: string;
  createdAt: string;
};

export type MeResponse = SessionUser & {
  name: string;
  status: string;
  role: string;
};

export function login(body: { email: string; password: string }) {
  return apiRequest<LoginResponse>('/api/v1/auth/login', { method: 'POST', body, auth: false });
}

/** The gateway field is `name` (not `fullName`) and allows 1 to 100 characters. */
export function register(body: { name: string; email: string; password: string }) {
  return apiRequest<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body,
    auth: false,
  });
}

export function verifyEmail(body: { email: string; otp: string }) {
  return apiRequest<{ success: boolean; message: string }>('/api/v1/auth/verify-email', {
    method: 'POST',
    body,
    auth: false,
  });
}

export function resendOtp(email: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: { email },
    auth: false,
  });
}

export function getMe() {
  return apiRequest<MeResponse>('/api/v1/auth/me');
}

/** Public route: it only needs the refresh token, so it also works with an expired access token. */
export function logout(refreshToken: string) {
  return apiRequest<void>('/api/v1/auth/logout', {
    method: 'POST',
    body: { refreshToken },
    auth: false,
  });
}
