import { ScrollView, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const modules = [
  {
    title: 'Telemetry',
    description: 'Track device health, power flow, and live status from one place.',
    icon: 'chart.bar.fill' as const,
  },
  {
    title: 'Scheduling',
    description: 'Shift load automatically with weather-aware and price-aware policies.',
    icon: 'house.fill' as const,
  },
  {
    title: 'Alerts',
    description: 'Surface exceptions with clear priority so operators can act quickly.',
    icon: 'gearshape.fill' as const,
  },
] as const;

const flow = ['Collect', 'Model', 'Act'];

export default function FeaturesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: theme.background }} contentContainerClassName="gap-4 p-5">
      <View>
        <View className="mb-3 self-start flex-row items-center gap-2 rounded-full border px-3 py-2" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <IconSymbol name="chart.bar.fill" color={theme.tint} size={18} />
          <Text className="text-xs font-bold" style={{ color: theme.muted }}>Feature driven screens</Text>
        </View>
        <Text className="text-[28px] font-extrabold leading-9" style={{ color: theme.text }}>Built around the same product flow as web</Text>
        <Text className="mt-2 text-[15px] leading-6" style={{ color: theme.muted }}>Each tab owns a focused domain area and its own UI.</Text>
      </View>

      <View className="gap-3">
        {modules.map((module) => (
          <View
            key={module.title}
            className="gap-3 rounded-[24px] border p-4"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: theme.surfaceAlt }}>
              <IconSymbol name={module.icon} color={theme.tint} size={22} />
            </View>
            <View className="gap-1.5">
              <Text className="text-base font-extrabold" style={{ color: theme.text }}>{module.title}</Text>
              <Text className="text-[13px] leading-[19px]" style={{ color: theme.muted }}>{module.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="gap-3 rounded-[24px] border p-4" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        <Text className="text-[18px] font-extrabold" style={{ color: theme.text }}>Flow</Text>
        <View className="gap-3.5">
          {flow.map((step, index) => (
            <View key={step} className="gap-2.5">
              <View className="h-[42px] w-[42px] items-center justify-center rounded-full" style={{ backgroundColor: theme.surfaceAlt }}>
                <Text className="text-base font-extrabold" style={{ color: theme.text }}>{index + 1}</Text>
              </View>
              <View className="gap-1.5">
                <Text className="text-[15px] font-extrabold" style={{ color: theme.text }}>{step}</Text>
                <Text className="text-[13px] leading-[19px]" style={{ color: theme.muted }}>
                  {index === 0
                    ? 'Capture live inputs from devices and weather.'
                    : index === 1
                      ? 'Turn raw data into clear operating signals.'
                      : 'Surface the next best action to the user.'}
                </Text>
              </View>
              {index < flow.length - 1 ? <View className="h-px" style={{ backgroundColor: theme.border }} /> : null}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}