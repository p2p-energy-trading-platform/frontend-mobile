import { ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { NotificationData, NotificationSection } from '../types';

import { NotificationGroup } from './NotificationGroup';

type NotificationListProps = {
  sections: readonly NotificationSection[];
  onPressItem?: (item: NotificationData) => void;
  onPressAction?: (item: NotificationData) => void;
};

/** The scrolling card that holds every group (Figma: Notification List Viewport). */
export function NotificationList({ sections, onPressItem, onPressAction }: NotificationListProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pb-6 pt-3"
      showsVerticalScrollIndicator
    >
      {sections.length > 0 ? (
        <View
          className="overflow-hidden rounded-2xl border"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          {sections.map((section) => (
            <NotificationGroup
              key={section.key}
              section={section}
              onPressItem={onPressItem}
              onPressAction={onPressAction}
            />
          ))}
        </View>
      ) : (
        <View
          className="items-center rounded-2xl border px-6 py-12"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
            No notifications
          </Text>
          <Text
            className="mt-1 text-center font-body text-xs"
            style={{ color: theme.textTertiary }}
          >
            You are all caught up.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
