import { useColorScheme } from '@/shared/hooks/use-color-scheme';

import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';
import { NavigationDarkTheme, NavigationLightTheme } from '../themes/navigation';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';

  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    isDark,

    theme: isDark ? darkTheme : lightTheme,

    navigationTheme: isDark ? NavigationDarkTheme : NavigationLightTheme,
  };
}
