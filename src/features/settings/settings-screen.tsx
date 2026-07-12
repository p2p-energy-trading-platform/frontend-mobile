import { useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

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
    <ScrollView className="flex-1" style={{ backgroundColor: theme.background }} contentContainerClassName="gap-4 p-5">
      <View className="gap-4 rounded-[28px] border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <View className="flex-row items-center gap-3.5">
          <View className="h-14 w-14 items-center justify-center rounded-[18px]" style={{ backgroundColor: theme.tint }}>
            <Text className="text-[18px] font-black" style={{ color: theme.background }}>GX</Text>
          </View>
          <View className="flex-1 gap-1.5">
            <Text className="text-[18px] font-extrabold" style={{ color: theme.text }}>GridX operator</Text>
            <Text className="text-[13px] font-semibold" style={{ color: theme.muted }}>Theme: {colorScheme}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between gap-3 rounded-[20px] p-3.5" style={{ backgroundColor: theme.surfaceAlt }}>
          <View className="flex-1 gap-1">
            <Text className="text-sm font-extrabold" style={{ color: theme.text }}>Push notifications</Text>
            <Text className="text-xs leading-[18px]" style={{ color: theme.muted }}>Receive important alerts on mobile.</Text>
          </View>
          <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
        </View>
      </View>

      <View className="gap-3.5 rounded-[28px] border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <Text className="text-[18px] font-extrabold" style={{ color: theme.text }}>Preferences</Text>

        <View className="gap-2">
          {preferences.map((item) => (
            <View key={item.title} className="flex-row items-center gap-3 border-t pt-3" style={{ borderTopColor: theme.border }}>
              <View className="h-[42px] w-[42px] items-center justify-center rounded-[14px]" style={{ backgroundColor: theme.surfaceAlt }}>
                <IconSymbol name={item.icon} color={theme.tint} size={18} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-sm font-extrabold" style={{ color: theme.text }}>{item.title}</Text>
                <Text className="text-xs leading-[18px]" style={{ color: theme.muted }}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}