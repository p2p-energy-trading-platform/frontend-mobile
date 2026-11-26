import { router } from 'expo-router';
import { Alert } from 'react-native';

import { ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/render';

import { getMe, login } from './api';
import SignInScreen from './SignInScreen';

jest.mock('./api', () => ({ login: jest.fn(), getMe: jest.fn() }));

// the SVG logo is not transformed by Jest
jest.mock('@/features/splash/components/GoogleButton', () => ({ GoogleButton: () => null }));
jest.mock('./use-google-sign-in', () => ({
  useGoogleSignIn: () => ({ signIn: jest.fn(), loading: false }),
}));

describe('SignInScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.getState().reset();
  });

  it('shows validation errors and stays on the screen when submitted empty', async () => {
    await renderWithProviders(<SignInScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByText('Password is required')).toBeOnTheScreen();
    expect(router.replace).not.toHaveBeenCalled();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });

  it('signs in and opens the app with valid details', async () => {
    await renderWithProviders(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), 'name@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret123');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

    expect(useAppStore.getState().isAuthenticated).toBe(true);
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('toggles remember me and password visibility', async () => {
    await renderWithProviders(<SignInScreen />);

    const remember = screen.getByRole('checkbox', { name: 'Remember me for 30 days' });
    expect(remember).not.toBeChecked();

    await fireEvent.press(remember);
    expect(remember).toBeChecked();

    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: 'Show password' }));
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  });

  it('opens create account from the footer', async () => {
    await renderWithProviders(<SignInScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Create account' }));

    expect(router.push).toHaveBeenCalledWith('/create-account');
  });

    it('signs in and opens the app with valid details', async () => {
    jest.mocked(login).mockResolvedValue({
      userId: 'user-1',
      email: 'name@example.com',
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 900,
    });
    jest.mocked(getMe).mockRejectedValue(new Error('offline'));

    await renderWithProviders(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), ' name@example.com ');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'secret123');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/(tabs)'));

    expect(login).toHaveBeenCalledWith({ email: 'name@example.com', password: 'secret123' });
    expect(useAppStore.getState().isAuthenticated).toBe(true);
  });

  it('shows an error and stays signed out when the credentials are wrong', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    jest
      .mocked(login)
      .mockRejectedValue(new ApiError('UNAUTHENTICATED', 'Invalid credentials.', 401));

    await renderWithProviders(<SignInScreen />);

    await fireEvent.changeText(screen.getByLabelText('Email address'), 'name@example.com');
    await fireEvent.changeText(screen.getByLabelText('Password'), 'wrong-password');
    await fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith('Sign in failed', 'Incorrect email or password.'),
    );

    expect(router.replace).not.toHaveBeenCalled();
    expect(useAppStore.getState().isAuthenticated).toBe(false);
  });
  
});

