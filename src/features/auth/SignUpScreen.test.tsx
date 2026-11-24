import { router } from 'expo-router';

import { fireEvent, renderWithProviders, screen } from '@/test/render';

import SignUpScreen from './SignUpScreen';
import { signUpContent } from './constants';

// the SVG logo is not transformed by Jest
jest.mock('@/features/splash/components/GoogleButton', () => ({ GoogleButton: () => null }));
jest.mock('./use-google-sign-in', () => ({
  useGoogleSignIn: () => ({ signIn: jest.fn(), loading: false }),
}));

const fillValidForm = async () => {
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

  it('shows every error and stays on the screen when submitted empty', async () => {
    await renderWithProviders(<SignUpScreen />);

    await fireEvent.press(screen.getByRole('button', { name: 'Create account' }));

    expect(screen.getByText('Enter a valid email address')).toBeOnTheScreen();
    expect(screen.getByText(/Password must be 8 to 128 characters/)).toBeOnTheScreen();
    expect(screen.getByText('Confirm your password')).toBeOnTheScreen();
    expect(screen.getByText('You must accept the terms to continue')).toBeOnTheScreen();
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
});
