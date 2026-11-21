import { Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

/** Page title + subtitle (Figma: Header). */
export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  const { theme } = useTheme();

  return (
    <View className="gap-3">
      <Text
        accessibilityRole="header"
        className="text-[28px] leading-9"
        style={{ fontFamily: FontFamily.heading, color: theme.text }}
      >
        {title}
      </Text>

      <Text
        className="text-[15px] leading-[22px]"
        style={{ fontFamily: FontFamily.body, color: theme.textSecondary }}
      >
        {subtitle}
      </Text>
    </View>
  );
}
