import { Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type LabelDividerProps = {
  label: string;
};

/** Horizontal rule with a centred label, e.g. "or continue with" (Figma: Divider). */
export function LabelDivider({ label }: LabelDividerProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1" style={{ backgroundColor: theme.borderSubtle }} />

      <Text
        className="text-xs"
        style={{ fontFamily: FontFamily.bodyMedium, color: theme.textPlaceholder }}
      >
        {label}
      </Text>

      <View className="h-px flex-1" style={{ backgroundColor: theme.borderSubtle }} />
    </View>
  );
}
