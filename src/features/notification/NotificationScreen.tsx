import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppShell } from '@/shared/components/ui/layout/AppShell';

import { NotificationList } from './components/NotificationList';
import { NotificationsHeader } from './components/NotificationHeader';
import { NotificationsToolbar } from './components/NotificationToolbar';
import { notifications as initialNotifications, notificationsHeader } from './constants';
import type { NotificationData } from './types';
import { groupNotifications } from './utils';

export default function NotificationsScreen() {
  const router = useRouter();

  const [items, setItems] = useState<NotificationData[]>(initialNotifications);
  const [showingUnreadOnly, setShowingUnreadOnly] = useState(false);

  const unreadCount = items.filter((item) => item.unread).length;
  const visibleItems = useMemo(
    () => (showingUnreadOnly ? items.filter((item) => item.unread) : items),
    [items, showingUnreadOnly],
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
    <AppShell unreadCount={unreadCount} initials={notificationsHeader.initials}>
      <View className="px-4 pt-5">
        <NotificationsHeader
          title={notificationsHeader.title}
          unreadCount={unreadCount}
          onBack={handleBack}
          onMarkAllRead={markAllRead}
        />

        <View className="pt-4">
          <NotificationsToolbar
            unreadCount={unreadCount}
            totalCount={items.length}
            showingUnreadOnly={showingUnreadOnly}
            onPressFilter={() => setShowingUnreadOnly((current) => !current)}
          />
        </View>
      </View>

      <NotificationList sections={sections} onPressItem={markRead} onPressAction={markRead} />
    </AppShell>
  );
}
