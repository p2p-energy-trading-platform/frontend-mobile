import { Stack } from 'expo-router';
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
  const { isDark } = useTheme();

  return (
    <QueryProvider>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />

        <Stack
          initialRouteName="splash"
          screenOptions={{
            headerShown: false,
            animation: 'default',
          }}
        />
      </SafeAreaProvider>
    </QueryProvider>
  );
}
