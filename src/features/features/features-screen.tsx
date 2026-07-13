import { ScrollView, Text, View } from 'react-native';
import { Screen } from '@/shared/components/layout/Screen';
import { IconSymbol } from '@/shared/components/ui/icon-symbol';
import { Colors } from '@/shared/constants/theme';
import { useColorScheme } from '@/shared/hooks/use-color-scheme';

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
    <Screen>
    <ScrollView className="flex-1 bg-background dark:bg-background-dark" contentContainerClassName="gap-4 p-5">
      <View>
        <View className="mb-3 self-start flex-row items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 dark:border-border-dark dark:bg-surface-dark">
          <IconSymbol name="chart.bar.fill" color={theme.tint} size={18} />
          <Text className="text-xs font-bold text-muted dark:text-muted-dark">Feature driven screens</Text>
        </View>
        <Text className="text-[28px] font-extrabold leading-9 text-text dark:text-text-dark">Built around the same product flow as web</Text>
        <Text className="mt-2 text-[15px] leading-6 text-muted dark:text-muted-dark">Each tab owns a focused domain area and its own UI.</Text>
      </View>

      <View className="gap-3">
        {modules.map((module) => (
          <View
            key={module.title}
            className="gap-3 rounded-[24px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark"
          >
            <View className="h-12 w-12 items-center justify-center rounded-2xl bg-surfaceAlt dark:bg-surfaceAlt-dark">
              <IconSymbol name={module.icon} color={theme.tint} size={22} />
            </View>
            <View className="gap-1.5">
              <Text className="text-base font-extrabold text-text dark:text-text-dark">{module.title}</Text>
              <Text className="text-[13px] leading-[19px] text-muted dark:text-muted-dark">{module.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="gap-3 rounded-[24px] border border-border bg-surface p-4 dark:border-border-dark dark:bg-surface-dark">
        <Text className="text-[18px] font-extrabold text-text dark:text-text-dark">Flow</Text>
        <View className="gap-3.5">
          {flow.map((step, index) => (
            <View key={step} className="gap-2.5">
              <View className="h-[42px] w-[42px] items-center justify-center rounded-full bg-surfaceAlt dark:bg-surfaceAlt-dark">
                <Text className="text-base font-extrabold text-text dark:text-text-dark">{index + 1}</Text>
              </View>
              <View className="gap-1.5">
                <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">{step}</Text>
                <Text className="text-[13px] leading-[19px] text-muted dark:text-muted-dark">
                  {index === 0
                    ? 'Capture live inputs from devices and weather.'
                    : index === 1
                      ? 'Turn raw data into clear operating signals.'
                      : 'Surface the next best action to the user.'}
                </Text>
              </View>
              {index < flow.length - 1 ? <View className="h-px bg-border dark:bg-border-dark" /> : null}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
    </Screen>
  );
}
