import { View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { AppText } from './AppText';

type ChipProps = {
  label: string;
  tone?: 'neutral' | 'success';
  dot?: boolean;
  semibold?: boolean;
};

export function Chip({ label, tone = 'neutral', dot = false, semibold = false }: ChipProps) {
  const { theme } = useTheme();

  const colors =
    tone === 'success'
      ? {
          background: theme.feedback.success.background,
          border: theme.feedback.success.border,
          text: theme.feedback.success.text,
        }
      : {
          background: theme.surface,
          border: theme.border,
          text: theme.textSecondary,
        };

  return (
    <View
      className="flex-row items-center gap-1.5 self-start rounded-full border px-2.5 py-1"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      {dot ? (
        <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.text }} />
      ) : null}

      <AppText
        style={{
          color: colors.text,
          fontSize: 12,
          lineHeight: 16,
          fontFamily: semibold ? FontFamily.bodySemibold : FontFamily.bodyMedium,
        }}
      >
        {label}
      </AppText>
    </View>
  );
}
