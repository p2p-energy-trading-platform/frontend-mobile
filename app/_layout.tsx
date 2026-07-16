import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import 'react-native-reanimated';
import '../global.css';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { navigationTheme, isDark } = useTheme();

  return (
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
  );
}