import { useColorScheme } from '@/shared/hooks/use-color-scheme';

import { darkTheme } from '../themes/dark';
import { lightTheme } from '../themes/light';

export function useTheme() {
  const colorScheme = useColorScheme() ?? 'light';

  const isDark = colorScheme === 'dark';

  return {
    colorScheme,
    isDark,

    theme: isDark ? darkTheme : lightTheme,
  };
}
