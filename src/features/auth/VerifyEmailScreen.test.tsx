import { router, useLocalSearchParams } from 'expo-router';

import { ApiError } from '@/lib/api-client';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/render';

import { resendOtp, verifyEmail } from './api';
import VerifyEmailScreen from './VerifyEmailScreen';
import { verifyEmailContent } from './constants';

jest.mock('./api', () => ({ verifyEmail: jest.fn(), resendOtp: jest.fn() }));

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

  it('spreads a pasted code over the boxes, verifies it and continues to KYC', async () => {
    jest.mocked(verifyEmail).mockResolvedValue({ success: true, message: 'Email verified.' });

    await renderWithProviders(<VerifyEmailScreen />);

    await enterCode('123456');

    expect(screen.getByLabelText('Verification code digit 6').props.value).toBe('6');

    const verify = screen.getByRole('button', { name: 'Verify email' });
    expect(verify).toBeEnabled();

    await fireEvent.press(verify);

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/kyc'));
    expect(verifyEmail).toHaveBeenCalledWith({ email: 'sampleperson1@example.ae', otp: '123456' });
  });

  it('shows an error and stays on the screen when the code is wrong', async () => {
    jest
      .mocked(verifyEmail)
      .mockRejectedValue(new ApiError('VALIDATION_ERROR', 'Invalid or expired code.', 400));

    await renderWithProviders(<VerifyEmailScreen />);

    await enterCode('123456');
    await fireEvent.press(screen.getByRole('button', { name: 'Verify email' }));

    expect(await screen.findByText('Invalid or expired code.')).toBeOnTheScreen();

    expect(router.push).not.toHaveBeenCalled();
  });

  it('lets the user resend the code', async () => {
    jest.mocked(resendOtp).mockResolvedValue({ success: true });

    await renderWithProviders(<VerifyEmailScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Resend code' }));

    await waitFor(() =>
      expect(screen.getByText(verifyEmailContent.resendNotice)).toBeOnTheScreen(),
    );
    expect(resendOtp).toHaveBeenCalledWith('sampleperson1@example.ae');

    const cooling = screen.getByRole('link', { name: 'Resend code in 60s' });
    expect(cooling).toBeDisabled();

    await fireEvent.press(cooling);
    expect(resendOtp).toHaveBeenCalledTimes(1);
  });

  it('disables resend while sending and shows resend failures inline', async () => {
    let resolveResend: (value: { success: boolean }) => void = () => {};
    jest.mocked(resendOtp).mockReturnValue(
      new Promise((resolve) => {
        resolveResend = resolve;
      }),
    );

    await renderWithProviders(<VerifyEmailScreen />);
    await fireEvent.press(screen.getByRole('link', { name: 'Resend code' }));

    const sending = screen.getByRole('link', { name: 'Sending…' });
    expect(sending).toBeDisabled();
    await fireEvent.press(sending);
    expect(resendOtp).toHaveBeenCalledTimes(1);

    resolveResend({ success: false });

    expect(
      await screen.findByText('We could not send a new code. Try again.'),
    ).toBeOnTheScreen();
  });

  it('goes back to create account from the footer', async () => {
    await renderWithProviders(<VerifyEmailScreen />);

    await fireEvent.press(screen.getByRole('link', { name: 'Change email address' }));

    expect(router.replace).toHaveBeenCalledWith('/create-account');
  });
});
