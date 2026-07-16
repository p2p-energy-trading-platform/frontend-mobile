import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { HapticTab } from '@/shared/navigation/haptic-tab';
import { Theme } from '@/shared/design-system/themes';

export function createTabScreenOptions(theme: Theme): BottomTabNavigationOptions {
  return {
    headerShown: false,

    tabBarButton: HapticTab,

    tabBarActiveTintColor: theme.tabBarActive,

    tabBarInactiveTintColor: theme.tabBarInactive,

    tabBarStyle: {
      backgroundColor: theme.tabBarBackground,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      height: 80,

      paddingTop: 10,
      elevation: 0,
    },
  };
}
