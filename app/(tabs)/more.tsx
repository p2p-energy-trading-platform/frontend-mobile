import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

const menuItems: { title: string; description: string; icon: IconName; route: string }[] = [
  {
    title: 'Forecast',
    description: 'Solar generation and energy outlook',
    icon: 'cloud-sun',
    route: '/forecast',
  },
  {
    title: 'History',
    description: 'Trades, orders, and statements',
    icon: 'clock-3',
    route: '/history',
  },
  {
    title: 'Notifications',
    description: 'Alerts and account updates',
    icon: 'notifications',
    route: '/notification',
  },
  {
    title: 'Settings',
    description: 'Profile, security, and preferences',
    icon: 'settings',
    route: '/settings',
  },
];

export default function MoreScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <AppShell initials="AA">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4 pb-8 pt-4"
      >
        <PageHeader title="More" subtitle="Explore your account and energy tools" />
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          {menuItems.map((item, index) => (
            <View key={item.title}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.title}
                onPress={() => router.push(item.route as never)}
                className="min-h-20 flex-row items-center gap-3 px-4 py-3"
              >
                <View
                  className="h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: theme.surfaceSecondary }}
                >
                  <Icon name={item.icon} size={19} color={theme.accent} />
                </View>
                <View className="flex-1 gap-1">
                  <AppText style={{ fontSize: 14, fontWeight: '600' }}>{item.title}</AppText>
                  <AppText style={{ fontSize: 12, color: theme.textSecondary }}>
                    {item.description}
                  </AppText>
                </View>
                <Icon name="chevron-right" size={18} color={theme.textTertiary} />
              </Pressable>
              {index < menuItems.length - 1 ? (
                <View className="ml-16 h-px" style={{ backgroundColor: theme.divider }} />
              ) : null}
            </View>
          ))}
        </Card>
      </ScrollView>
    </AppShell>
  );
}
