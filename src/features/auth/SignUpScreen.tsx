import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { LabelDivider } from '@/shared/components/ui/LabelDivider';
import { TextField } from '@/shared/components/ui/TextField';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthGoogleButton } from './components/AuthGoogleButton';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { PasswordField } from './components/PasswordField';
import { StepIndicator } from './components/StepIndicator';
import { TermsCheckbox } from './components/TermsCheckbox';
import { AUTH_TOTAL_STEPS, signUpContent } from './constants';
import { useSignUp } from './hooks';

export default function SignUpScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const form = useSignUp();

  const showTerms = () =>
    Alert.alert(signUpContent.termsLink, 'The Terms of Service will be available soon.');

  const showPrivacy = () =>
    Alert.alert(signUpContent.privacyLink, 'The Privacy Policy will be available soon.');

  return (
    <AuthLayout
      spacing="tight"
      onBack={goBack}
      topBarRight={<StepIndicator step={1} total={AUTH_TOTAL_STEPS} />}
      footer={
        <AuthFooter
          prompt={signUpContent.footerPrompt}
          actionLabel={signUpContent.footerAction}
          onAction={() => router.replace('/sign-in')}
        />
      }
    >
      <AuthHeader compact title={signUpContent.title} subtitle={signUpContent.subtitle} />

      <View className="gap-5">
        <TextField
          label={signUpContent.fullNameLabel}
          placeholder={signUpContent.fullNamePlaceholder}
          value={form.fullName}
          onChangeText={form.setFullName}
          onBlur={() => form.touch('fullName')}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          error={form.errors.fullName}
        />

        <TextField
          label={signUpContent.emailLabel}
          placeholder={signUpContent.emailPlaceholder}
          value={form.email}
          onChangeText={form.setEmail}
          onBlur={() => form.touch('email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={form.errors.email}
        />

        <PasswordField
          label={signUpContent.passwordLabel}
          placeholder={signUpContent.passwordPlaceholder}
          helper={signUpContent.passwordHint}
          value={form.password}
          onChangeText={form.setPassword}
          onBlur={() => form.touch('password')}
          autoComplete="new-password"
          textContentType="newPassword"
          error={form.errors.password}
        />

        <PasswordField
          label={signUpContent.confirmationLabel}
          placeholder={signUpContent.confirmationPlaceholder}
          value={form.confirmation}
          onChangeText={form.setConfirmation}
          onBlur={() => form.touch('confirmation')}
          autoComplete="new-password"
          textContentType="newPassword"
          error={form.errors.confirmation}
        />
      </View>

      <TermsCheckbox
        checked={form.accepted}
        onChange={form.setAccepted}
        onTermsPress={showTerms}
        onPrivacyPress={showPrivacy}
        error={form.errors.terms}
      />

      <View className="gap-5">
        <AuthButton title={signUpContent.submit} disabled={form.submitting} onPress={form.submit} />

        <LabelDivider label={signUpContent.divider} />

        <AuthGoogleButton />
      </View>
    </AuthLayout>
  );
}
