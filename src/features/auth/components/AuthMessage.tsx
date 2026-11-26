import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type AuthMessageProps = {
  /** Nothing is shown when empty. */
  message?: string;
  tone?: 'error' | 'success';
};

/** Inline banner for the result of an auth request. */
export function AuthMessage({ message, tone = 'error' }: AuthMessageProps) {
  const { theme } = useTheme();

  if (!message) return null;

  const colors = theme.feedback[tone];

  return (
    <View
      accessibilityLiveRegion="polite"
      className="flex-row items-start gap-3 rounded-xl border p-3"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <Icon
        name={tone === 'error' ? 'error-outline' : 'check-circle'}
        size={18}
        color={colors.icon}
      />

      <AppText
        accessibilityRole="alert"
        className="flex-1"
        preset="bodyRelaxed"
        style={{ color: colors.text }}
      >
        {message}
      </AppText>
    </View>
  );
}