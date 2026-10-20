import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { Screen } from '@/shared/components/ui/Screen';
import { useAppStore } from '@/store/app-store';

import { SplashActions } from './components/SplashActions';
import { SplashBrand } from './components/SplashBrand';

export default function SplashScreen() {
  const router = useRouter();

  const setAuthenticated = useAppStore((state) => state.setAuthenticated);

  // TODO(auth): replace with the real email sign-up, Google OAuth and sign-in flows.
  // Until then every action simply enters the app.
  const enterApp = () => {
    setAuthenticated(true);

    router.replace('/');
  };

  return (
    <Screen>
      <View className="flex-1 px-6 pb-16">
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
