import { router } from 'expo-router';
import { Alert } from 'react-native';

import { ApiError } from '@/lib/api-client';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/render';

import { register } from './api';
import SignUpScreen from './SignUpScreen';
import { signUpContent } from './constants';
import { FULL_NAME_MAX_LENGTH } from './utils';

jest.mock('./api', () => ({ register: jest.fn() }));
// the SVG logo is not transformed by Jest
jest.mock('@/features/splash/components/GoogleButton', () => ({ GoogleButton: () => null }));
jest.mock('./use-google-sign-in', () => ({
  useGoogleSignIn: () => ({ signIn: jest.fn(), loading: false }),
}));

const fillValidForm = async () => {
  await fireEvent.changeText(screen.getByLabelText(signUpContent.fullNameLabel), ' Jane Doe ');
  await fireEvent.changeText(screen.getByLabelText('Email address'), ' name@example.com ');
  await fireEvent.changeText(screen.getByLabelText('Password'), 'secret123');
  await fireEvent.changeText(screen.getByLabelText('Confirm password'), 'secret123');
  await fireEvent.press(screen.getByRole('checkbox', { name: signUpContent.termsLabel }));
};

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the step indicator and the password hint', async () => {
    await renderWithProviders(<SignUpScreen />);

    expect(screen.getByText('Step 1 of 4')).toBeOnTheScreen();
    expect(screen.getByText(signUpContent.passwordHint)).toBeOnTheScreen();
  });

  it('asks for the full name', async () => {
    await renderWithProviders(<SignUpScreen />);

    expect(screen.getByLabelText(signUpContent.fullNameLabel)).toBeOnTheScreen();
  });

  it('shows every error and stays on the screen when submitted empty', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Full legal name is required')).toBeOnTheScreen();
    expect(screen.getByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByText(/Password must be 8 to 128 characters/)).toBeOnTheScreen();
    expect(screen.getByText('Confirm your password')).toBeOnTheScreen();
    expect(screen.getByText('You must accept the terms to continue')).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('rejects a full name longer than the maximum', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fillValidForm();
    await fireEvent.changeText(
      screen.getByLabelText(signUpContent.fullNameLabel),
      'a'.repeat(FULL_NAME_MAX_LENGTH + 1),
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    expect(
      screen.getByText(`Full legal name must be ${FULL_NAME_MAX_LENGTH} characters or fewer`),
    ).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('flags a password confirmation that does not match', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret123');
    await fireEvent.changeText(screen.getByLabelText('Confirm password'), 'different1');
    await fireEvent(screen.getByLabelText('Confirm password'), 'blur');

    expect(screen.getByText('Passwords do not match')).toBeOnTheScreen();
  });

  it('continues to email verification with valid details', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    expect(router.push).toHaveBeenCalledWith({
      pathname: '/verify-email',
      params: { email: 'name@example.com' },
    });
  });

  it('goes to sign in from the footer', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Sign in' }));

    expect(router.replace).toHaveBeenCalledWith('/sign-in');
  });

  it('creates the account and continues to email verification', async () => {
    jest.mocked(register).mockResolvedValue({
      userId: 'user-1',
      email: 'name@example.com',
      status: 'PENDING',
      createdAt: '2026-01-01T00:00:00.000Z',
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 900,
    });

    await renderWithProviders(<SignUpScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(router.push).toHaveBeenCalledWith({
        pathname: '/verify-email',
        params: { email: 'name@example.com' },
      }),
    );

    expect(register).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'name@example.com',
      password: 'secret123',
    });
  });

  it('shows an error and stays on the screen when the email is already registered', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest.mocked(register).mockRejectedValue(new ApiError('CONFLICT', 'Already exists.', 409));

    await renderWithProviders(<SignUpScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith(
        'Could not create account',
        'An account with this email already exists. Try signing in instead.',
      ),
    );

    expect(router.push).not.toHaveBeenCalled();
  });
});
