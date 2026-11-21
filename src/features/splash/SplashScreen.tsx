import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { useGoogleSignIn } from '@/features/auth/use-google-sign-in';
import { Screen } from '@/shared/components/ui/Screen';

import { SplashActions } from './components/SplashActions';
import { SplashBrand } from './components/SplashBrand';

export default function SplashScreen() {
  const router = useRouter();
  const google = useGoogleSignIn();

  return (
    <Screen>
      <View className="flex-1 px-6 pb-16">
        <View className="flex-1" />

        <SplashBrand />

        <View className="h-24" />

        <SplashActions
          onSignUpWithEmail={() => router.push('/create-account')}
          onContinueWithGoogle={() => void google.signIn()}
          googleLoading={google.loading}
          onSignIn={() => router.push('/sign-in')}
        />

        <View className="flex-1" />
      </View>
    </Screen>
  );
}
