import { router } from 'expo-router';

import { useAppStore } from '@/store/app-store';
import { fireEvent, renderWithProviders, screen } from '@/test/render';

import SignInScreen from './SignInScreen';

// the SVG logo is not transformed by Jest
jest.mock('@/features/splash/components/GoogleButton', () => ({ GoogleButton: () => null }));

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

  it('opens create account from the footer and skips to the portal from the demo shortcut', async () => {
    await renderWithProviders(<SignInScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Create account' }));
    expect(router.push).toHaveBeenCalledWith('/create-account');

    await fireEvent.press(screen.getByRole('link', { name: 'Skip to portal' }));
    expect(router.replace).toHaveBeenCalledWith('/(tabs)');
  });
});
