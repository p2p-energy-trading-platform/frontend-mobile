import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Spacing, Typography } from '@/shared/design-system/tokens';

type GoogleButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function GoogleButton({ onPress, style }: GoogleButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      className="h-12 flex-row items-center justify-center gap-2.5 rounded-xl border px-5"
      onPress={onPress}
      style={[
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        style,
      ]}
    >
      <AppText
        style={{
          color: '#4285F4',
          fontSize: Spacing[5],
          fontWeight: Typography.fontWeight.bold,
        }}
      >
        G
      </AppText>

      <AppText style={{ fontWeight: Typography.fontWeight.semibold }}>Continue with Google</AppText>
    </Pressable>
  );
}
