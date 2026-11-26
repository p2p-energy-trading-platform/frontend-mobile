import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { OtpInput } from '@/shared/components/ui/OtpInput';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { IconBadge } from './components/IconBadge';
import { PromptLink } from './components/PromptLink';
import { StepIndicator } from './components/StepIndicator';
import { VerifyEmailSubtitle } from './components/VerifyEmailSubtitle';
import { AUTH_TOTAL_STEPS, verifyEmailContent } from './constants';
import { useVerifyEmail } from './hooks';
import { OTP_LENGTH, maskEmail } from './utils';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const form = useVerifyEmail();

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
        <AuthButton
          title={verifyEmailContent.submit}
          disabled={!form.codeValid || form.verifying}
          onPress={form.verify}
        />

        <PromptLink
          prompt={verifyEmailContent.resendPrompt}
          actionLabel={verifyEmailContent.resendAction}
          onAction={form.resend}
        />
      </View>
    </AuthLayout>
  );
}
