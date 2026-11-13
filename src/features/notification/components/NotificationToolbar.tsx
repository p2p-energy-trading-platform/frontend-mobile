import { Text, View } from 'react-native';

import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { statusFilterOptions } from '../constants';
import type { NotificationStatusFilter } from '../types';

type NotificationsToolbarProps = {
  status: NotificationStatusFilter;
  onStatusChange: (status: NotificationStatusFilter) => void;
  unreadCount: number;
  totalCount: number;
};

/** Status dropdown (All / Unread / Read) + "3 unread · 12 total". */
export function NotificationsToolbar({
  status,
  onStatusChange,
  unreadCount,
  totalCount,
}: NotificationsToolbarProps) {
  const { theme } = useTheme();

  return (
    <View className="h-9 flex-row items-center justify-between">
      <FilterDropdown
        options={statusFilterOptions}
        value={status}
        onChange={onStatusChange}
        accessibilityLabel="Notification status filter"
      />

      <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
        {unreadCount} unread · {totalCount} total
      </Text>
    </View>
  );
}
