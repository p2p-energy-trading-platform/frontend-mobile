import { Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

export type StatusTone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export function StatusPill({ label, tone }: { label: string; tone: StatusTone }) {
  const { theme } = useTheme();
  const colors =
    tone === 'neutral'
      ? { background: theme.surfaceSecondary, border: theme.border, text: theme.textTertiary }
      : {
          background: theme.feedback[tone].background,
          border: theme.feedback[tone].border,
          text: theme.feedback[tone].icon,
        };

  return (
    <View
      className="rounded-full border px-2 py-0.5"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <Text
        className="font-body-semibold text-[10px] leading-[15px]"
        style={{ color: colors.text }}
      >
        {label}
      </Text>
    </View>
  );
}
