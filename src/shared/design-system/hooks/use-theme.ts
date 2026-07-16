import { useColorScheme } from '@/shared/hooks/use-color-scheme';

import {
  NavigationDarkTheme,
  NavigationLightTheme,
} from '../themes/navigation';

import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';

  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    isDark,

    theme: isDark ? darkTheme : lightTheme,

    navigationTheme: isDark
      ? NavigationDarkTheme
      : NavigationLightTheme,
  };
}