import { apiRequest } from '@/lib/api-client';
import { saveAuthTokens, type AuthTokens } from '@/lib/auth-token-store';

export type AuthResponse = AuthTokens & {
  userId: string;
  email: string;
};

export type RegisterResponse = AuthResponse & {
  status: 'PENDING';
  createdAt: string;
};

export function register(name: string, email: string, password: string) {
  return apiRequest<RegisterResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  }).then(async (response) => {
    await saveAuthTokens(response);
    return response;
  });
}

export function login(email: string, password: string) {
  return apiRequest<AuthResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).then(async (response) => {
    await saveAuthTokens(response);
    return response;
  });
}

export function verifyEmail(email: string, otp: string) {
  return apiRequest<{ success: boolean; message: string }>('/api/v1/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export function resendOtp(email: string) {
  return apiRequest<{ success: boolean }>('/api/v1/auth/resend-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
