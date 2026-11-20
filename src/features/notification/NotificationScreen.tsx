import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

import { FilterChips } from '@/shared/components/ui/FilterChips';
import { Screen } from '@/shared/components/ui/Screen';

import { NotificationList } from './components/NotificationList';
import { NotificationsHeader } from './components/NotificationHeader';
import { NotificationsToolbar } from './components/NotificationToolbar';
import {
  categoryFilterOptions,
  notifications as initialNotifications,
  notificationsHeader,
} from './constants';
import type {
  NotificationCategoryFilter,
  NotificationData,
  NotificationStatusFilter,
} from './types';
import { groupNotifications } from './utils';

export default function NotificationsScreen() {
  const router = useRouter();

  const [items, setItems] = useState<NotificationData[]>(initialNotifications);
  const [status, setStatus] = useState<NotificationStatusFilter>('all');
  const [category, setCategory] = useState<NotificationCategoryFilter>('all');

  const unreadCount = items.filter((item) => item.unread).length;

  const visibleItems = useMemo(
    () =>
      items.filter((item) => {
        if (status === 'unread' && !item.unread) return false;
        if (status === 'read' && item.unread) return false;
        if (category !== 'all' && item.category !== category) return false;

        return true;
      }),
    [items, status, category],
  );

  const sections = useMemo(() => groupNotifications(visibleItems), [visibleItems]);

  /** Back to the screen the user came from (e.g. Energy). Falls back to Home if there is no history. */
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const markAllRead = () => setItems((prev) => prev.map((item) => ({ ...item, unread: false })));

  const markRead = (target: NotificationData) =>
    setItems((prev) =>
      prev.map((item) => (item.id === target.id ? { ...item, unread: false } : item)),
    );

  return (
    <Screen>
      <NotificationsHeader
        title={notificationsHeader.title}
        unreadCount={unreadCount}
        onBack={handleBack}
        onMarkAllRead={markAllRead}
      />

      <View className="gap-3 pt-3">
        <View className="px-4">
          <NotificationsToolbar
            status={status}
            onStatusChange={setStatus}
            unreadCount={unreadCount}
            totalCount={items.length}
          />
        </View>

        <FilterChips
          options={categoryFilterOptions}
          value={category}
          onChange={setCategory}
          gutter={16}
        />
      </View>

      <NotificationList sections={sections} onPressItem={markRead} onPressAction={markRead} />
    </Screen>
  );
}
