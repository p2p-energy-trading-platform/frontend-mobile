import { useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { Screen } from '@/shared/components/ui/Screen';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

const preferences = [
  {
    title: 'Automatic Theme',
    subtitle: 'Matches the device appearance so light and dark stay in sync.',
    icon: 'settings',
  },
  {
    title: 'Smart Alerts',
    subtitle: 'Keep only high-signal notifications enabled.',
    icon: 'notifications',
  },
  {
    title: 'Remote Sync',
    subtitle: 'Keep dashboard data fresh across devices.',
    icon: 'sync',
  },
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, colorScheme } = useTheme();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="gap-5 p-5">
        <Pressable onPress={() => router.push('/forecast' as Href)}>
          <Card>
            <View className="flex-row items-center gap-3">
              <View
                className="h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.surfaceAlt }}
              >
                <Icon color={theme.accent} name="trending-up" size={20} />
              </View>
              <View className="flex-1 gap-1">
                <AppText variant="body">24-Hour Price Forecast</AppText>
                <AppText variant="caption" style={{ color: theme.textSecondary }}>
                  Plan your energy trades around the next 24 hours.
                </AppText>
              </View>
              <Icon color={theme.textTertiary} name="chevron-right" size={18} />
            </View>
          </Card>
        </Pressable>
        {/* Profile */}

        <Card>
          <View className="gap-4">
            <View className="flex-row items-center gap-4">
              <View
                className="h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor: theme.primary,
                }}
              >
                <AppText
                  variant="title"
                  style={{
                    color: theme.primaryForeground,
                  }}
                >
                  GX
                </AppText>
              </View>

              <View className="flex-1 gap-1">
                <AppText variant="title">GridX Operator</AppText>

                <AppText
                  variant="caption"
                  style={{
                    color: theme.textSecondary,
                  }}
                >
                  Theme: {colorScheme}
                </AppText>
              </View>
            </View>

            <View
              className="flex-row items-center justify-between rounded-2xl p-4"
              style={{
                backgroundColor: theme.surfaceAlt,
              }}
            >
              <View className="flex-1 gap-1">
                <AppText variant="body">Push Notifications</AppText>

                <AppText
                  variant="caption"
                  style={{
                    color: theme.textSecondary,
                  }}
                >
                  Receive important alerts on mobile.
                </AppText>
              </View>

              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
            </View>
          </View>
        </Card>

        {/* Preferences */}

        <Card>
          <View className="gap-4">
            <AppText variant="title">Preferences</AppText>

            {preferences.map((item, index) => (
              <View key={item.title}>
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-11 w-11 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: theme.surfaceAlt,
                    }}
                  >
                    <Icon name={item.icon} size={20} color={theme.primary} />
                  </View>

                  <View className="flex-1 gap-1">
                    <AppText variant="body">{item.title}</AppText>

                    <AppText
                      variant="caption"
                      style={{
                        color: theme.textSecondary,
                      }}
                    >
                      {item.subtitle}
                    </AppText>
                  </View>
                </View>

                {index < preferences.length - 1 && (
                  <View
                    className="mt-4 h-px"
                    style={{
                      backgroundColor: theme.border,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}
