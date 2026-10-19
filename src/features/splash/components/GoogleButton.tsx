import { Pressable, StyleProp, ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

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
      className="items-center justify-center rounded-xl border px-5 py-3"
      onPress={onPress}
      style={[
        {
          height: 52,
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
        style,
      ]}
    >
      <AppText style={{ fontWeight: '600' }}>Continue with Google</AppText>
    </Pressable>
  );
}
