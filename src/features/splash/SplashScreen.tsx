import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/shared/components/ui/Screen';

import { SplashActions } from './components/SplashActions';
import { SplashBrand } from './components/SplashBrand';

export default function SplashScreen() {
  const router = useRouter();
  const enterApp = () => router.replace('/');

  return (
    <Screen>
      <View className="flex-1 px-6 pb-[72px]">
        <View className="flex-1" />

        <SplashBrand />

        <View className="h-24" />

        <SplashActions
          onSignUpWithEmail={enterApp}
          onContinueWithGoogle={enterApp}
          onSignIn={enterApp}
        />

        <View className="flex-1" />
      </View>
    </Screen>
  );
}
