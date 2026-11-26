import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { OtpInput } from '@/shared/components/ui/OtpInput';
import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { AuthMessage } from './components/AuthMessage';
import { IconBadge } from './components/IconBadge';
import { PromptLink } from './components/PromptLink';
import { StepIndicator } from './components/StepIndicator';
import { VerifyEmailSubtitle } from './components/VerifyEmailSubtitle';
import { AUTH_TOTAL_STEPS, verifyEmailContent } from './constants';
import { useVerifyEmail } from './hooks';
import { OTP_LENGTH, maskEmail } from './utils';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const form = useVerifyEmail();
  // With no history (opened by the unverified redirect), Home would only redirect back here.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/splash');
    }
  };

  const resendLabel = form.resending
    ? verifyEmailContent.resendingAction
    : form.resendSecondsLeft > 0
      ? verifyEmailContent.resendCooldownAction(form.resendSecondsLeft)
      : verifyEmailContent.resendAction;
  const recipient = form.email ? maskEmail(form.email) : verifyEmailContent.fallbackRecipient;

  return (
    <AuthLayout
      spacing="normal"
      onBack={goBack}
      topBarRight={<StepIndicator step={2} total={AUTH_TOTAL_STEPS} />}
      footer={
        <AuthFooter
          prompt={verifyEmailContent.footerPrompt}
          actionLabel={verifyEmailContent.footerAction}
          onAction={() => router.replace('/create-account')}
        />
      }
    >
      <AuthHeader
        compact
        icon={<IconBadge icon="mail" />}
        title={verifyEmailContent.title}
        subtitle={<VerifyEmailSubtitle recipient={recipient} />}
      />

      <OtpInput
        value={form.code}
        onChange={form.setCode}
        length={OTP_LENGTH}
        helper={verifyEmailContent.hint}
      />

      <View className="gap-5">
        <AuthMessage message={form.formError} />
        <AuthMessage message={form.notice} tone="success" />
        <AuthButton
          title={verifyEmailContent.submit}
          disabled={!form.codeValid || form.verifying}
          onPress={form.verify}
        />

        <PromptLink
          prompt={verifyEmailContent.resendPrompt}
          actionLabel={resendLabel}
          onAction={form.resend}
          disabled={form.resending || form.resendSecondsLeft > 0}
        />
      </View>
    </AuthLayout>
  );
}
