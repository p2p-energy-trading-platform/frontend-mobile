import { Screen } from '@/shared/components/ui/Screen';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

const preferences = [
  {
    title: 'Automatic theme',
    subtitle: 'Matches the device appearance so light and dark stay in sync.',
    icon: 'gearshape.fill' as const,
  },
  {
    title: 'Smart alerts',
    subtitle: 'Keep only high-signal notifications enabled.',
    icon: 'chart.bar.fill' as const,
  },
  {
    title: 'Remote sync',
    subtitle: 'Keep dashboard data fresh across devices.',
    icon: 'house.fill' as const,
  },
] as const;

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <Screen>
    <ScrollView className="flex-1 bg-background dark:bg-background-dark" contentContainerClassName="gap-4 p-5">
      <View className="gap-4 rounded-[28px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <View className="flex-row items-center gap-3.5">
          <View className="h-14 w-14 items-center justify-center rounded-[18px] bg-tint dark:bg-tint-dark">
            <Text className="text-[18px] font-black text-background dark:text-background-dark">GX</Text>
          </View>
          <View className="flex-1 gap-1.5">
            <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">GridX operator</Text>
            <Text className="text-[13px] font-semibold text-muted dark:text-muted-dark">Theme: {colorScheme}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-3 rounded-[20px] bg-surfaceAlt p-3.5 dark:bg-surfaceAlt-dark">
          <View className="flex-1 gap-1">
            <Text className="text-sm font-extrabold text-text dark:text-text-dark">Push notifications</Text>
            <Text className="text-xs leading-[18px] text-muted dark:text-muted-dark">Receive important alerts on mobile.</Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </View>

      <View className="gap-3.5 rounded-[28px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">Preferences</Text>

        <View className="gap-2">
          {preferences.map((item) => (
            <View key={item.title} className="flex-row items-center gap-3 border-t border-border pt-3 dark:border-border-dark">
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-surfaceAlt dark:bg-surfaceAlt-dark">
                <IconSymbol name={item.icon} color={theme.tint} size={18} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-sm font-extrabold text-text dark:text-text-dark">{item.title}</Text>
                <Text className="text-xs leading-[18px] text-muted dark:text-muted-dark">{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </Screen>
  );
}
