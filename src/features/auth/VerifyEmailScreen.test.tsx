import { router, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';

import { fireEvent, renderWithProviders, screen } from '@/test/render';

import VerifyEmailScreen from './VerifyEmailScreen';
import { verifyEmailContent } from './constants';

const mockedParams = jest.mocked(useLocalSearchParams);

const enterCode = async (code: string) => {
  await fireEvent.changeText(screen.getByLabelText('Verification code digit 1'), code);
};

describe('VerifyEmailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedParams.mockReturnValue({ email: 'sampleperson1@example.ae' });
  });

  it('shows step 2 and the masked email', async () => {
    await renderWithProviders(<VerifyEmailScreen />);

    expect(screen.getByText('Step 2 of 4')).toBeOnTheScreen();
    expect(screen.getByText('sa•••••••••••@example.ae')).toBeOnTheScreen();
    expect(screen.getByText(verifyEmailContent.hint)).toBeOnTheScreen();
  });

  it('falls back to a generic recipient when there is no email', async () => {
    mockedParams.mockReturnValue({});

    await renderWithProviders(<VerifyEmailScreen />);

    expect(screen.getByText('your email address')).toBeOnTheScreen();
  });

  it('keeps the verify button disabled until the code is complete', async () => {
    await renderWithProviders(<VerifyEmailScreen />);

    const verify = screen.getByRole('button', { name: 'Verify email' });
    expect(verify).toBeDisabled();

    await enterCode('123');
    expect(verify).toBeDisabled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('spreads a pasted code over the boxes and continues to KYC', async () => {
    await renderWithProviders(<VerifyEmailScreen />);

    await enterCode('123456');

    expect(screen.getByLabelText('Verification code digit 6').props.value).toBe('6');

    const verify = screen.getByRole('button', { name: 'Verify email' });
    expect(verify).toBeEnabled();

    await fireEvent.press(verify);
    expect(router.push).toHaveBeenCalledWith('/kyc');
  });

  it('lets the user resend the code', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);

    await renderWithProviders(<VerifyEmailScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Resend code' }));

    expect(alert).toHaveBeenCalledWith('Resend code', verifyEmailContent.resendNotice);
  });

  it('goes back to create account from the footer', async () => {
    await renderWithProviders(<VerifyEmailScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Change email address' }));

    expect(router.replace).toHaveBeenCalledWith('/create-account');
  });
});
