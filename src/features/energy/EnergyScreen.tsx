import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { PageHeader } from '@/shared/components/ui/PageHeader';

import { AssetsPanel } from './components/AssetsPanel';
import { EnergyControls, type EnergyView } from './components/EnergyControls';
import { EnergyPanels } from './components/EnergyPanels';
import { SolarGenerationCard } from './components/SolarGenerationCard';
import { energyHeader, solar } from './constants';
import type { Period } from './utils';

export default function EnergyScreen() {
  const [view, setView] = useState<EnergyView>('usage');
  const [period, setPeriod] = useState<Period>('day');
  const [date, setDate] = useState(() => new Date());

  const header = (
    <View className="px-6">
      <PageHeader title={energyHeader.title} subtitle={energyHeader.subtitle} />
    </View>
  );

  const controls = (
    <View className="px-6">
      <EnergyControls
        view={view}
        onViewChange={setView}
        period={period}
        onPeriodChange={setPeriod}
        date={date}
        onDateChange={setDate}
      />
    </View>
  );

  return (
    <AppShell unreadCount={energyHeader.unreadCount} initials={energyHeader.initials}>

      <ScrollView
        className={view === 'usage' ? 'flex-1' : 'hidden'}
        contentContainerStyle={{ flexGrow: 1, gap: 12, paddingTop: 12, paddingBottom: 10 }}
      >
        {header}
        {controls}

        <View className="px-6">
          <SolarGenerationCard {...solar} />
        </View>

        <EnergyPanels />
      </ScrollView>

      <View className={view === 'assets' ? 'flex-1 gap-3 pt-3' : 'hidden'}>
        {header}
        {controls}

        <AssetsPanel />
      </View>
    </AppShell>
  );
}
