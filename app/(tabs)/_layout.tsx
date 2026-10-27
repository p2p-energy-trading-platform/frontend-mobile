import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { createTabScreenOptions } from '@/shared/navigation';
import { renderTabLabel } from '@/shared/navigation/tab-options';
import { useAppStore } from '@/store/app-store';

export default function TabLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/splash" />;
  }

  return (
    <Tabs screenOptions={createTabScreenOptions(theme, insets.bottom)}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: renderTabLabel('Home'),
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="energy"
        options={{
          title: 'Energy',
          tabBarLabel: renderTabLabel('Energy'),
          tabBarIcon: ({ color }) => <Icon name="bolt" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trade',
          tabBarLabel: renderTabLabel('Trade'),
          tabBarIcon: ({ color }) => <Icon name="trending-up" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Wallet',
          tabBarLabel: renderTabLabel('Wallet'),
          tabBarIcon: ({ color }) => <Icon name="account-balance-wallet" color={color} size={22} />,
        }}
      />

      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarLabel: renderTabLabel('More'),
          tabBarIcon: ({ color }) => <Icon name="apps" color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
