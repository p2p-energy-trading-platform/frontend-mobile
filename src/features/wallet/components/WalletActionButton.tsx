import { Pressable } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type WalletActionButtonProps = {
  title: string;
  icon: IconName;
  onPress: () => void;
  primary?: boolean;
};

export function WalletActionButton({
  title,
  icon,
  onPress,
  primary = false,
}: WalletActionButtonProps) {
  const { theme } = useTheme();
  const color = primary ? theme.accentForeground : theme.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border"
      style={{
        backgroundColor: primary ? theme.accent : theme.surface,
        borderColor: primary ? theme.accent : theme.border,
      }}
    >
      <Icon name={icon} size={17} color={color} />
      <AppText className="font-body-semibold text-sm" style={{ color }}>
        {title}
      </AppText>
    </Pressable>
  );
}
