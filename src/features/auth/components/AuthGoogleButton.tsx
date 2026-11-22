import { Alert } from 'react-native';

import { GoogleButton } from '@/features/splash/components/GoogleButton';
import { FormControl } from '@/shared/design-system/tokens';

// same height and radius as the text fields above it
const STYLE = { height: FormControl.height, borderRadius: FormControl.radius } as const;

/** "Continue with Google" button used on the sign in and sign up screens. */
export function AuthGoogleButton() {
  const handlePress = () => Alert.alert('Google sign in', 'Google sign in is not connected yet.');

  return <GoogleButton style={STYLE} onPress={handlePress} />;
}
