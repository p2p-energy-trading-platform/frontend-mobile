import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { PageHeader } from '@/shared/components/ui/PageHeader';

import { AssetsPlaceholder } from './components/AssetsPlaceholder';
import { EnergyControls, type EnergyView } from './components/EnergyControls';
import { EnergyPanels } from './components/EnergyPanels';
import { SolarGenerationCard } from './components/SolarGenerationCard';
import { energyHeader, solar } from './constants';
import type { Period } from './utils';

export default function EnergyScreen() {
  const [view, setView] = useState<EnergyView>('usage');
  const [period, setPeriod] = useState<Period>('day');
  const [date, setDate] = useState(() => new Date());

  return (
    <AppShell unreadCount={energyHeader.unreadCount} initials={energyHeader.initials}>
      {/* flexGrow lets the active panel stretch to fill the screen; it scrolls if content is taller */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, gap: 12, paddingTop: 12, paddingBottom: 10 }}
      >
        <View className="px-6">
          <PageHeader title={energyHeader.title} subtitle={energyHeader.subtitle} />
        </View>

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

        {view === 'usage' ? (
          <>
            <View className="px-6">
              <SolarGenerationCard {...solar} />
            </View>

            <EnergyPanels />
          </>
        ) : (
          <View className="px-6">
            <AssetsPlaceholder />
          </View>
        )}
      </ScrollView>
    </AppShell>
  );
}
