import { ColorValue, Text } from 'react-native';

import { Theme } from '@/shared/design-system/themes';
import { FontFamily } from '@/shared/design-system/tokens';
import { HapticTab } from '@/shared/navigation/haptic-tab';

export function renderTabLabel(title: string) {
  return function TabLabel({ focused, color }: { focused: boolean; color: ColorValue }) {
    return (
      <Text
        style={{
          color,
          fontSize: 11,
          lineHeight: 14,
          fontFamily: focused ? FontFamily.bodySemibold : FontFamily.bodyMedium,
        }}
      >
        {title}
      </Text>
    );
  };
}

export function createTabScreenOptions(theme: Theme) {
  return {
    headerShown: false,

    tabBarButton: HapticTab,

    tabBarActiveTintColor: theme.tabBarActive,

    tabBarInactiveTintColor: theme.tabBarInactive,

    tabBarStyle: {
      backgroundColor: theme.tabBarBackground,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      height: 81,
      paddingTop: 8,
      paddingBottom: 28,
      elevation: 0,
    },
  };
}
