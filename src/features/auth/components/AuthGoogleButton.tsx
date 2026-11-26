import { View } from 'react-native';

import { GoogleButton } from '@/features/splash/components/GoogleButton';
import { FormControl } from '@/shared/design-system/tokens';

import { useGoogleSignIn } from '../use-google-sign-in';
import { AuthMessage } from './AuthMessage';

// same height and radius as the text fields above it
const STYLE = { height: FormControl.height, borderRadius: FormControl.radius } as const;

/** "Continue with Google" button used on the sign in and sign up screens. */
export function AuthGoogleButton() {
  const google = useGoogleSignIn();

  return (
    <View className="gap-3">
      <GoogleButton style={STYLE} loading={google.loading} onPress={() => void google.signIn()} />

      <AuthMessage message={google.error} />
    </View>
  );
}
