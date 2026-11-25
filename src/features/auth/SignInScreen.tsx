import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { Checkbox } from '@/shared/components/ui/Checkbox';
import { LabelDivider } from '@/shared/components/ui/LabelDivider';
import { TextField } from '@/shared/components/ui/TextField';
import { TextLink } from '@/shared/components/ui/TextLink';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthGoogleButton } from './components/AuthGoogleButton';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { LogoMark } from './components/LogoMark';
import { PasswordField } from './components/PasswordField';
import { signInContent } from './constants';
import { useSignIn } from './hooks';

export default function SignInScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const form = useSignIn();

  const handleForgotPassword = () =>
    Alert.alert(
      signInContent.forgotPassword,
      'Password recovery will be available when account services are connected.',
    );

  return (
    <AuthLayout
      onBack={goBack}
      topBarRight={<LogoMark />}
      footer={
        <>
          <AuthFooter
            prompt={signInContent.footerPrompt}
            actionLabel={signInContent.footerAction}
            onAction={() => router.push('/create-account')}
          />
        </>
      }
    >
      <AuthHeader title={signInContent.title} subtitle={signInContent.subtitle} />

      <View className="gap-5">
        <TextField
          label={signInContent.emailLabel}
          placeholder={signInContent.emailPlaceholder}
          value={form.email}
          onChangeText={form.setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={form.errors.email}
        />

        <PasswordField
          label={signInContent.passwordLabel}
          labelAction={
            <TextLink
              size="sm"
              label={signInContent.forgotPassword}
              onPress={handleForgotPassword}
            />
          }
          placeholder={signInContent.passwordPlaceholder}
          value={form.password}
          onChangeText={form.setPassword}
          error={form.errors.password}
        />
      </View>

      <Checkbox
        checked={form.remember}
        onChange={form.setRemember}
        label={signInContent.rememberMe}
      />

      <View className="gap-5">
        <AuthButton title={signInContent.submit} onPress={form.submit} />

        <LabelDivider label={signInContent.divider} />

        <AuthGoogleButton />
      </View>
    </AuthLayout>
  );
}
