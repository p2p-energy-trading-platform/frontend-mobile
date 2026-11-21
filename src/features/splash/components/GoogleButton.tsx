import { ActivityIndicator, Pressable, StyleProp, ViewStyle } from 'react-native';

import GoogleIcon from '@assets/icons/google.svg';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Typography } from '@/shared/design-system/tokens';

type GoogleButtonProps = {
  onPress?: () => void;
  /** Shows a spinner and blocks taps while sign-in is in progress. */
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

function GoogleMark() {
  return <GoogleIcon accessible={false} height={18} width={18} />;
}

export function GoogleButton({ onPress, loading = false, style }: GoogleButtonProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Continue with Google"
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
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
      {loading ? <ActivityIndicator size="small" color={theme.textSecondary} /> : <GoogleMark />}

      <AppText style={{ fontWeight: Typography.fontWeight.semibold }}>Continue with Google</AppText>
    </Pressable>
  );
}
