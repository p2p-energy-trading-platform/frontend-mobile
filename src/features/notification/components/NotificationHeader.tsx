import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type NotificationsHeaderProps = {
  title: string;
  unreadCount: number;
  onBack?: () => void;
  onMarkAllRead?: () => void;
};

/** Top bar: back icon · title · "mark all as read" icon. */
export function NotificationsHeader({
  title,
  unreadCount,
  onBack,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  const { theme } = useTheme();

  const disabled = unreadCount === 0;

  return (
    <View
      className="h-14 flex-row items-center gap-2 border-b px-4"
      style={{ borderColor: theme.border }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        onPress={onBack}
        className="-ml-2 h-10 w-10 items-center justify-center rounded-xl"
      >
        <Icon name="arrow-back" size={22} color={theme.text} />
      </Pressable>

      <Text
        numberOfLines={1}
        className="flex-1 font-heading text-lg leading-7"
        style={{ color: theme.text }}
      >
        {title}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mark all notifications as read"
        accessibilityState={{ disabled }}
        disabled={disabled}
        hitSlop={8}
        onPress={onMarkAllRead}
        className={`-mr-2 h-10 w-10 items-center justify-center rounded-xl ${
          disabled ? 'opacity-40' : ''
        }`}
      >
        <Icon name="check-all" size={22} color={disabled ? theme.textTertiary : theme.accent} />
      </Pressable>
    </View>
  );
}
