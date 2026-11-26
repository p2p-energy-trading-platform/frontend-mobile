import { ApiError } from '@/lib/api-client';

export type AuthAction = 'signIn' | 'register' | 'verifyEmail' | 'resendOtp';

/** Turns an API failure into a message the user can act on. */
export function getAuthErrorMessage(error: unknown, action: AuthAction): string {
  if (!(error instanceof ApiError)) {
    return 'Something went wrong. Please try again.';
  }

  switch (error.code) {
    case 'NETWORK':
    case 'TIMEOUT':
      return error.message;

    case 'RATE_LIMITED':
      return 'Too many attempts. Please wait a minute and try again.';

    case 'UNAUTHENTICATED':
      return action === 'signIn' ? 'Incorrect email or password.' : error.message;

    case 'CONFLICT':
      return action === 'register'
        ? 'An account with this email already exists. Try signing in instead.'
        : error.message;

    case 'UPSTREAM_UNAVAILABLE':
    case 'UPSTREAM_TIMEOUT':
    case 'INTERNAL_ERROR':
      return 'GridX is having trouble right now. Please try again shortly.';

    // VALIDATION_ERROR, FORBIDDEN, NOT_FOUND, BAD_REQUEST: the gateway message is meant for users
    // (for example "invalid or expired code").
    default:
      return error.message;
  }
}