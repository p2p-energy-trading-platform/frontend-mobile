import { Pressable, ScrollView, Text, View } from 'react-native';

import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';

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
    <ScrollView className="flex-1" style={{ backgroundColor: theme.background }} contentContainerClassName="gap-4 p-5">
      <View className="gap-4 rounded-[28px] border p-[18px]" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: theme.surfaceAlt }}>
            <IconSymbol name="house.fill" color={theme.tint} size={18} />
            <Text className="text-[13px] font-bold" style={{ color: theme.text }}>GridX mobile</Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-full px-3 py-2" style={{ backgroundColor: theme.surfaceAlt }}>
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.tint }} />
            <Text className="text-xs font-semibold" style={{ color: theme.muted }}>Live sync</Text>
          </View>
        </View>

        <Text className="text-[32px] font-extrabold leading-9" style={{ color: theme.text }}>Operations at a glance</Text>
        <Text className="text-[15px] leading-6" style={{ color: theme.muted }}>
          Track active sites, forecast quality, and open alerts in one place.
        </Text>

        <View className="flex-row gap-3">
          <Pressable className="min-h-[52px] flex-1 items-center justify-center rounded-[18px]" style={{ backgroundColor: theme.tint }}>
            <Text className="text-sm font-extrabold" style={{ color: theme.background }}>Review alerts</Text>
          </Pressable>
          <Pressable className="min-h-[52px] flex-1 items-center justify-center rounded-[18px] border" style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border }}>
            <Text className="text-sm font-bold" style={{ color: theme.text }}>Open map</Text>
          </Pressable>
        </View>
      </View>

      <View className="gap-3">
        {metrics.map((metric) => (
          <View
            key={metric.label}
            className="gap-1 rounded-[22px] border p-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <Text className="text-[28px] font-extrabold" style={{ color: theme.text }}>{metric.value}</Text>
            <Text className="text-sm font-bold" style={{ color: theme.muted }}>{metric.label}</Text>
            <Text className="text-xs" style={{ color: theme.muted }}>{metric.note}</Text>
          </View>
        ))}
      </View>

      <View className="gap-3 rounded-[24px] border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <View className="flex-row items-center justify-between">
          <Text className="text-[18px] font-extrabold" style={{ color: theme.text }}>Live activity</Text>
          <Text className="text-xs font-semibold" style={{ color: theme.muted }}>Updated now</Text>
        </View>

        {activity.map((item) => (
          <View key={item.title} className="flex-row items-center gap-3 border-t pt-3" style={{ borderTopColor: theme.border }}>
            <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.tint }} />
            <View className="flex-1 gap-1">
              <Text className="text-sm font-bold" style={{ color: theme.text }}>{item.title}</Text>
              <Text className="text-xs" style={{ color: theme.muted }}>{item.detail}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}