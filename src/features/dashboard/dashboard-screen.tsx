import { Screen } from '@/shared/components/ui/Screen';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';
import { Pressable, ScrollView, Text, View } from 'react-native';

const metrics = [
  { label: 'Active sites', value: '24', note: '+4 this week' },
  { label: 'Live alerts', value: '03', note: '1 needs attention' },
  { label: 'Forecast accuracy', value: '96%', note: 'Rolling 7 day average' },
];

const activity = [
  { title: 'Demand response window', detail: 'Starts in 18 minutes' },
  { title: 'Weather model synced', detail: 'Updated from the latest forecast' },
  { title: 'Battery cluster online', detail: '12 devices reporting' },
];

export default function DashboardScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Screen>
    <ScrollView className="flex-1 bg-background dark:bg-background-dark" contentContainerClassName="gap-4 p-5">
      <View className="gap-4 rounded-[28px] border border-border bg-surface p-[18px] dark:border-border-dark dark:bg-surface-dark">
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-2 rounded-full bg-surfaceAlt px-3 py-2 dark:bg-surfaceAlt-dark">
            <IconSymbol name="house.fill" color={theme.tint} size={18} />
            <Text className="text-[13px] font-bold text-text dark:text-text-dark">GridX mobile</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full bg-surfaceAlt px-3 py-2 dark:bg-surfaceAlt-dark">
            <View className="h-2 w-2 rounded-full bg-tint dark:bg-tint-dark" />
            <Text className="text-xs font-semibold text-muted dark:text-muted-dark">Live sync</Text>
          </View>
        </View>

        <Text className="text-[32px] font-extrabold leading-9 text-text dark:text-text-dark">Operations at a glance</Text>
        <Text className="text-[15px] leading-6 text-muted dark:text-muted-dark">
          Track active sites, forecast quality, and open alerts in one place.
        </Text>

        <View className="flex-row gap-3">
          <Pressable className="min-h-[52px] flex-1 items-center justify-center rounded-[18px] bg-tint dark:bg-tint-dark">
            <Text className="text-sm font-extrabold text-background dark:text-background-dark">Review alerts</Text>
          </Pressable>
          <Pressable className="min-h-[52px] flex-1 items-center justify-center rounded-[18px] border border-border bg-surfaceAlt dark:border-border-dark dark:bg-surfaceAlt-dark">
            <Text className="text-sm font-bold text-text dark:text-text-dark">Open map</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-3">
        {metrics.map((metric) => (
          <View
            key={metric.label}
            className="gap-1 rounded-[22px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <Text className="text-[28px] font-extrabold text-text dark:text-text-dark">{metric.value}</Text>
            <Text className="text-sm font-bold text-muted dark:text-muted-dark">{metric.label}</Text>
            <Text className="text-xs text-muted dark:text-muted-dark">{metric.note}</Text>
          </View>
        ))}
      </View>

      <View className="gap-3 rounded-[24px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <View className="flex-row items-center justify-between">
          <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">Live activity</Text>
          <Text className="text-xs font-semibold text-muted dark:text-muted-dark">Updated now</Text>
        </View>

        {activity.map((item) => (
          <View key={item.title} className="flex-row items-center gap-3 border-t border-border pt-3 dark:border-border-dark">
            <View className="h-2.5 w-2.5 rounded-full bg-tint dark:bg-tint-dark" />
            <View className="flex-1 gap-1">
              <Text className="text-sm font-bold text-text dark:text-text-dark">{item.title}</Text>
              <Text className="text-xs text-muted dark:text-muted-dark">{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    </Screen>
  );
}
