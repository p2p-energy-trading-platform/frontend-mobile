import { ScrollView, View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/Appshell';
import { AppText } from '@/shared/components/ui/AppText';
import { FontFamily } from '@/shared/design-system/tokens';

import { CurrentSlotCard } from './components/CurrentSlotCard';
import { EnergyPositionCard } from './components/EnergyPositionCard';
import { GreetingHeader } from './components/GreetingHeader';
import { QuickActions } from './components/QuickActions';
import { SummaryCard } from './components/SummaryCard';
import { dashboardData } from './constants';

export default function DashboardScreen() {
  const { userName, property, meterStatus, position, summary, slot } = dashboardData;

  return (
    <AppShell>
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-6 py-4">
        <GreetingHeader name={userName} property={property} meterStatus={meterStatus} />

        <EnergyPositionCard {...position} />

        <QuickActions />

        <View className="gap-3">
          <AppText style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
            Today
          </AppText>

          <View className="flex-row gap-3">
            {summary.map((item) => (
              <SummaryCard key={item.key} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </View>

          <CurrentSlotCard {...slot} />
        </View>
      </ScrollView>
    </AppShell>
  );
}
