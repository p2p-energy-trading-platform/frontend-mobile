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

const TAB_BAR_CONTENT_HEIGHT = 45;
const TAB_BAR_PADDING_TOP = 8;
const TAB_BAR_MIN_PADDING_BOTTOM = 8;

export function createTabScreenOptions(theme: Theme, bottomInset = 0) {
  const paddingBottom = Math.max(bottomInset, TAB_BAR_MIN_PADDING_BOTTOM);

  return {
    headerShown: false,

    tabBarButton: HapticTab,

    tabBarActiveTintColor: theme.tabBarActive,

    tabBarInactiveTintColor: theme.tabBarInactive,

    tabBarStyle: {
      backgroundColor: theme.tabBarBackground,
      borderTopColor: theme.border,
      borderTopWidth: 1,
      height: TAB_BAR_PADDING_TOP + TAB_BAR_CONTENT_HEIGHT + paddingBottom,
      paddingTop: TAB_BAR_PADDING_TOP,
      paddingBottom,
      elevation: 0,
    },
  };
}
