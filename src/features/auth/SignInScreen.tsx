import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { GoogleButton } from '@/features/splash/components/GoogleButton';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import { LabelDivider } from '@/shared/components/ui/LabelDivider';
import { TextField } from '@/shared/components/ui/TextField';
import { TextLink } from '@/shared/components/ui/TextLink';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { DemoShortcut } from './components/DemoShortcut';
import { PasswordField } from './components/PasswordField';
import { signInContent } from './constants';
import { useSignIn } from './hooks';

// Figma: Google button is 52 high with 16 radius on this screen
const GOOGLE_BUTTON = { height: 52, borderRadius: 16 } as const;

export default function SignInScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const form = useSignIn();

  const handleForgotPassword = () =>
    Alert.alert(
      signInContent.forgotPassword,
      'Password recovery will be available when account services are connected.',
    );

  const handleGoogleSignIn = () =>
    Alert.alert('Google sign in', 'Google sign in is not connected yet.');

  return (
    <AuthLayout
      onBack={goBack}
      footer={
        <>
          <AuthFooter
            prompt={signInContent.footerPrompt}
            actionLabel={signInContent.footerAction}
            onAction={() => router.push('/create-account')}
          />

          <DemoShortcut onPress={form.skipToPortal} />
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

      <View className="gap-6">
        <AuthButton title={signInContent.submit} onPress={form.submit} />

        <LabelDivider label={signInContent.divider} />

        <GoogleButton style={GOOGLE_BUTTON} onPress={handleGoogleSignIn} />
      </View>
    </AuthLayout>
  );
}
