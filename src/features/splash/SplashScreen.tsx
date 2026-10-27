import { useRouter } from 'expo-router';
import { Alert, View } from 'react-native';

import { Screen } from '@/shared/components/ui/Screen';

import { SplashActions } from './components/SplashActions';
import { SplashBrand } from './components/SplashBrand';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View className="flex-1 px-6 pb-16">
        <View className="flex-1" />

        <SplashBrand />

        <View className="h-24" />

        <SplashActions
          onSignUpWithEmail={() => router.push('/create-account')}
          onContinueWithGoogle={() =>
            Alert.alert('Google sign in', 'Google sign in is not connected yet.')
          }
          onSignIn={() => router.push('/sign-in')}
        />

        <View className="flex-1" />
      </View>
    </Screen>
  );
}
