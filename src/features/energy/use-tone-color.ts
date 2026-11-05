import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { IconTone } from './types';

export function useToneColor(): Record<IconTone, string> {
  const { theme } = useTheme();

  return {
    warning: theme.feedback.warning.icon,
    info: theme.feedback.info.icon,
    accent: theme.accent,
  };
}
