import { Text, View } from 'react-native';

import { TextLink } from '@/shared/components/ui/TextLink';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type AuthFooterProps = {
  prompt: string;
  actionLabel: string;
  onAction: () => void;
};

/** "Don’t have an account? Create account" row (Figma: Footer). */
export function AuthFooter({ prompt, actionLabel, onAction }: AuthFooterProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center justify-center gap-1 px-6 pt-2">
      <Text
        className="text-sm leading-5"
        style={{ fontFamily: FontFamily.body, color: theme.textSecondary }}
      >
        {prompt}
      </Text>

      <TextLink label={actionLabel} onPress={onAction} />
    </View>
  );
}