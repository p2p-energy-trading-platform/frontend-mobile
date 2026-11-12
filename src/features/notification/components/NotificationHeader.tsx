import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type NotificationsHeaderProps = {
  title: string;
  unreadCount: number;
  onBack?: () => void;
  onMarkAllRead?: () => void;
};

/** Title + unread badge + "Mark all read" button (Figma: Heading row). */
export function NotificationsHeader({
  title,
  unreadCount,
  onBack,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  const { theme } = useTheme();

  const disabled = unreadCount === 0;

  return (
    <View className="h-8 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          className="-ml-1.5 h-8 w-8 items-center justify-center rounded-xl"
        >
          <Icon name="arrow-back" size={20} color={theme.text} />
        </Pressable>

        <Text className="font-heading text-xl leading-7" style={{ color: theme.text }}>
          {title}
        </Text>
        {unreadCount > 0 ? (
          <View
            className="h-5 w-5 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.accent }}
          >
            <Text
              className="font-body-bold text-[10px] leading-[15px]"
              style={{ color: theme.accentForeground }}
            >
              {unreadCount}
            </Text>
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Mark all notifications as read"
        disabled={disabled}
        onPress={onMarkAllRead}
        className={`min-h-7 flex-row items-center gap-1.5 rounded-xl border px-3 py-1.5 ${
          disabled ? 'opacity-50' : ''
        }`}
        style={{ backgroundColor: theme.fill, borderColor: theme.border }}
      >
        <Icon name="check-all" size={13} color={theme.secondaryForeground} />

        <Text className="font-body-semibold text-xs" style={{ color: theme.secondaryForeground }}>
          Mark all read
        </Text>
      </Pressable>
    </View>
  );
}
