import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Themes } from '@/shared/design-system/themes';

export function useTheme() {
  const scheme = useColorScheme();

  return Themes[scheme ?? 'light'];
}