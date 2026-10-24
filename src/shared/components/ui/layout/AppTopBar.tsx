import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type AppTopBarProps = {
  unreadCount?: number;
  initials?: string;
  onPressHelp?: () => void;
  onPressNotifications?: () => void;
  onPressAccount?: () => void;
};

export function AppTopBar({
  unreadCount = 0,
  initials = 'SA',
  onPressHelp,
  onPressNotifications,
  onPressAccount,
}: AppTopBarProps) {
  const { theme } = useTheme();

  return (
    <View
      className="h-14 flex-row items-center border-b px-4"
      style={{ backgroundColor: theme.surface, borderBottomColor: theme.border }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundColor: theme.accent }}
        >
          <Icon name="bolt" size={16} color={theme.accentForeground} />
        </View>

        <AppText style={{ fontSize: 18, fontFamily: FontFamily.heading }}>GridX</AppText>
      </View>

      <View className="flex-1" />

      <View className="flex-row items-center gap-1">
        <Pressable
          accessibilityLabel="Help and settings"
          onPress={onPressHelp}
          className="h-8 w-8 items-center justify-center rounded-xl"
        >
          <Icon name="help-outline" size={17} color={theme.textTertiary} />
        </Pressable>

        <Pressable
          accessibilityLabel={`Notifications, ${unreadCount} unread`}
          onPress={onPressNotifications}
          className="h-8 w-8 items-center justify-center rounded-xl"
        >
          <Icon name="notifications-none" size={17} color={theme.textTertiary} />

          {unreadCount > 0 ? (
            <View
              className="absolute right-0 top-0 h-4 w-4 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.accent }}
            >
              <AppText
                style={{
                  color: theme.accentForeground,
                  fontSize: 9,
                  lineHeight: 14,
                  fontFamily: FontFamily.bodyBold,
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </AppText>
            </View>
          ) : null}
        </Pressable>

        <View className="mx-1 h-5 w-px" style={{ backgroundColor: theme.border }} />

        <Pressable
          accessibilityLabel="Account settings"
          onPress={onPressAccount}
          className="h-7 w-7 items-center justify-center rounded-full"
          style={{ backgroundColor: theme.accent }}
        >
          <AppText
            style={{
              color: theme.accentForeground,
              fontSize: 10,
              lineHeight: 15,
              fontFamily: FontFamily.bodyBold,
            }}
          >
            {initials}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
