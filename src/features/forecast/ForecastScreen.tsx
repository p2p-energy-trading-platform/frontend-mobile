import { ScrollView, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

const forecast = [
  { day: 'Today', date: '25 Nov', icon: 'sun', generation: '18.4 kWh', note: 'Clear skies' },
  {
    day: 'Tomorrow',
    date: '26 Nov',
    icon: 'cloud-sun',
    generation: '16.8 kWh',
    note: 'Partly cloudy',
  },
  { day: 'Thursday', date: '27 Nov', icon: 'sun', generation: '19.1 kWh', note: 'Clear skies' },
] as const;

export default function ForecastScreen() {
  const { theme } = useTheme();

  return (
    <AppShell initials="AA">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 px-4 pb-8 pt-4">
        <PageHeader title="Forecast" subtitle="Your upcoming solar generation" />
        <Card>
          <View className="gap-2">
            <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>NEXT 24 HOURS</AppText>
            <AppText style={{ fontSize: 28, fontWeight: '700' }}>18.4 kWh</AppText>
            <View className="flex-row items-center gap-2">
              <Icon name="sun" size={16} color={theme.warning} />
              <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>
                Expected solar generation · Dubai
              </AppText>
            </View>
          </View>
        </Card>
        <View className="gap-2">
          <AppText style={{ fontSize: 15, fontWeight: '700' }}>3-day outlook</AppText>
          <Card className="gap-4">
            {forecast.map((item, index) => (
              <View key={item.day}>
                {index ? (
                  <View className="mb-4 h-px" style={{ backgroundColor: theme.divider }} />
                ) : null}
                <View className="flex-row items-center gap-3">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: theme.surfaceAlt }}
                  >
                    <Icon name={item.icon} size={20} color={theme.warning} />
                  </View>
                  <View className="flex-1 gap-1">
                    <AppText style={{ fontSize: 13, fontWeight: '600' }}>{item.day}</AppText>
                    <AppText style={{ fontSize: 11, color: theme.textSecondary }}>
                      {item.date} · {item.note}
                    </AppText>
                  </View>
                  <AppText style={{ fontSize: 13, fontWeight: '700' }}>{item.generation}</AppText>
                </View>
              </View>
            ))}
          </Card>
        </View>
        <AppText style={{ color: theme.textTertiary, fontSize: 11, lineHeight: 16 }}>
          Forecast values are estimates based on your smart meter and expected local conditions.
        </AppText>
      </ScrollView>
    </AppShell>
  );
}
