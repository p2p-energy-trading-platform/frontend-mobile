import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { NotificationData, NotificationPriority, NotificationTone } from '../types';

type NotificationItemProps = {
  item: NotificationData;
  isLast?: boolean;
  onPress?: (item: NotificationData) => void;
  onPressAction?: (item: NotificationData) => void;
};

export function NotificationItem({
  item,
  isLast = false,
  onPress,
  onPressAction,
}: NotificationItemProps) {
  const { theme } = useTheme();

  const iconColor: Record<NotificationTone, string> = {
    trade: theme.trade.sellText,
    success: theme.feedback.success.text,
    warning: theme.feedback.warning.icon,
    info: theme.feedback.info.text,
    neutral: theme.textTertiary,
  };
  const tileColor: Record<NotificationTone, string> = {
    trade: theme.trade.sellBackground,
    success: theme.feedback.success.background,
    warning: theme.feedback.warning.background,
    info: theme.feedback.info.background,
    neutral: theme.surfaceAlt,
  };
  const dotColor: Record<NotificationPriority, string> = {
    high: theme.error,
    normal: theme.feedback.info.icon,
    low: theme.textDisabled,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}${item.unread ? ', unread' : ''}`}
      onPress={() => onPress?.(item)}
      className="flex-row items-start gap-3 border-b px-5 py-4"
      style={{
        backgroundColor: item.unread ? theme.surfaceAlt : theme.surface,
        borderBottomColor: isLast ? 'transparent' : theme.borderSubtle,
      }}
    >
      {/* Unread accent bar */}
      {item.unread ? (
        <View
          className="absolute bottom-0 left-0 top-0 w-0.5 rounded-r"
          style={{ backgroundColor: theme.accent }}
        />
      ) : null}

      <View
        className="mt-0.5 h-9 w-9 items-center justify-center rounded-2xl"
        style={{ backgroundColor: tileColor[item.tone] }}
      >
        <Icon name={item.icon} size={15} color={iconColor[item.tone]} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1 flex-row items-center gap-1.5">
            <Text
              numberOfLines={1}
              className="shrink font-body-semibold text-sm"
              style={{ color: theme.text }}
            >
              {item.title}
            </Text>

            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: dotColor[item.priority] }}
            />
          </View>

          <Text
            className="font-body text-[10px] leading-[15px]"
            style={{ color: theme.textDisabled }}
          >
            {item.time}
          </Text>
        </View>

        <Text
          numberOfLines={2}
          className="mt-0.5 font-body text-xs leading-[19.5px]"
          style={{ color: theme.textTertiary }}
        >
          {item.body}
        </Text>

        {item.action ? (
          <Pressable
            accessibilityRole="link"
            onPress={(event) => {
              event.stopPropagation();
              onPressAction?.(item);
            }}
            className="mt-2 flex-row items-center gap-1 self-start"
          >
            <Text className="font-body-semibold text-xs" style={{ color: theme.accent }}>
              {item.action}
            </Text>
            <Icon name="chevron-right" size={11} color={theme.accent} />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
}
