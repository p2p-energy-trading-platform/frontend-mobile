import { Tabs } from 'expo-router';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { createTabScreenOptions } from '@/shared/navigation';

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs screenOptions={createTabScreenOptions(theme)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Overview',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="home"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="features"
        options={{
          title: 'Features',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="star"
              color={color}
              size={size}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="settings"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}