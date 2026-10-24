import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { PlusJakartaSans_700Bold } from '@expo-google-fonts/plus-jakarta-sans';
import { RobotoMono_700Bold } from '@expo-google-fonts/roboto-mono';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import 'react-native-reanimated';
import '../global.css';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { QueryProvider } from '@/providers';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { navigationTheme, isDark } = useTheme();

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    PlusJakartaSans_700Bold,
    RobotoMono_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryProvider>
      <ThemeProvider value={navigationTheme}>
        <SafeAreaProvider>
          <StatusBar style={isDark ? 'light' : 'dark'} />

          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'default',
            }}
          />
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
