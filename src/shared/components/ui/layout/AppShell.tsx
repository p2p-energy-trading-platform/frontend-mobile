import { usePathname, useRouter } from 'expo-router';
import { PropsWithChildren, useRef } from 'react';
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
export function AppShell({ children, unreadCount = 0, initials }: AppShellProps) {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isOpeningRef = useRef(false);

  const openNotifications = () => {
    // Already on the notifications screen, or a tap was just handled: ignore.
    if (pathname === '/notification' || isOpeningRef.current) return;

    isOpeningRef.current = true;
    router.push('/notification');

    // Release the lock once the transition has finished.
    setTimeout(() => {
      isOpeningRef.current = false;
    }, 800);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: theme.surface }}>
        <AppTopBar
          unreadCount={unreadCount}
          initials={initials}
          onPressNotifications={openNotifications}
        />
      </SafeAreaView>

      <View className="flex-1">{children}</View>
    </View>
  );
}
