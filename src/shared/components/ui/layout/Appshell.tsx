import { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppTopBar } from './AppTopBar';

type AppShellProps = PropsWithChildren<{
  unreadCount?: number;
  initials?: string;
}>;

/**
 * Top bar + content area. The bottom nav comes from the Expo Router <Tabs> layout,
 * so the safe area is only applied at the top here.
 */
export function AppShell({ children, unreadCount = 3, initials = 'SA' }: AppShellProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface }}>
        <AppTopBar unreadCount={unreadCount} initials={initials} />
      </SafeAreaView>

      <View className="flex-1">{children}</View>
    </View>
  );
}
