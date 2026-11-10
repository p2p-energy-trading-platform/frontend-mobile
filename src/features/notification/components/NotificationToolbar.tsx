import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type NotificationsToolbarProps = {
  unreadCount: number;
  totalCount: number;
  showingUnreadOnly: boolean;
  onPressFilter?: () => void;
};

/** Filter button + "3 unread · 12 total" (Figma: History controls). */
export function NotificationsToolbar({
  unreadCount,
  totalCount,
  showingUnreadOnly,
  onPressFilter,
}: NotificationsToolbarProps) {
  const { theme } = useTheme();

  return (
    <View className="h-9 flex-row items-center justify-between">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          showingUnreadOnly ? 'Show all notifications' : 'Show unread notifications'
        }
        accessibilityState={{ selected: showingUnreadOnly }}
        onPress={onPressFilter}
        className="h-9 flex-row items-center gap-2 rounded-xl border px-3.5"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <Icon name="list-filter" size={16} color={theme.text} />

        <Text className="font-body-medium text-xs" style={{ color: theme.text }}>
          {showingUnreadOnly ? 'Unread' : 'All'}
        </Text>
      </Pressable>

      <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
        {unreadCount} unread · {totalCount} total
      </Text>
    </View>
  );
}
