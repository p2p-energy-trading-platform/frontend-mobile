import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/Appshell';
import { Card } from '@/shared/components/ui/Card';
import { AppText } from '@/shared/components/ui/AppText';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { DateStepper } from './components/DateStepper';
import { EnergyBalanceCard } from './components/EnergyBalanceCard';
import { EnergyTimeSeriesCard } from './components/EnergyTimesSeriesCard';
import { InsightsSection } from './components/InsightSection';
import { SolarGenerationCard } from './components/SolarGeneration';
import { UsageByCategoryCard } from './components/UsageByCategoryCard';
import {
  balanceSources,
  energyHeader,
  exportEarned,
  insights,
  periodOptions,
  solar,
  timeAxis,
  timeSeries,
  timeSeriesLegend,
  usageCategories,
  usageTotal,
  viewOptions,
} from './constants';
import { formatPeriodLabel, isAtLatest, shiftDate, type Period } from './utils';

type View_ = (typeof viewOptions)[number]['value'];

export default function EnergyScreen() {
  const { theme } = useTheme();

  const [view, setView] = useState<View_>('usage');
  const [period, setPeriod] = useState<Period>('day');
  const [date, setDate] = useState(() => new Date());

  return (
    <AppShell unreadCount={energyHeader.unreadCount} initials={energyHeader.initials}>
      <ScrollView className="flex-1" contentContainerClassName="gap-6 px-6 py-6">
        <PageHeader title={energyHeader.title} subtitle={energyHeader.subtitle} />

        <View className="gap-3">
          <SegmentedControl options={viewOptions} value={view} onChange={setView} />

          <View className="flex-row items-center justify-between">
            <SegmentedControl
              size="sm"
              options={periodOptions}
              value={period}
              onChange={setPeriod}
            />

            <DateStepper
              label={formatPeriodLabel(date, period)}
              onPrevious={() => setDate((d) => shiftDate(d, period, -1))}
              onNext={() => setDate((d) => shiftDate(d, period, 1))}
              nextDisabled={isAtLatest(date, period)}
            />
          </View>
        </View>

        {view === 'usage' ? (
          <>
            <SolarGenerationCard {...solar} />

            <EnergyTimeSeriesCard series={timeSeries} axis={timeAxis} legend={timeSeriesLegend} />

            <EnergyBalanceCard sources={balanceSources} footer={exportEarned} />

            <UsageByCategoryCard total={usageTotal} categories={usageCategories} />

            <InsightsSection insights={insights} />
          </>
        ) : (
          <Card>
            <View className="items-center gap-1 py-6">
              <AppText style={{ fontSize: 14, fontFamily: FontFamily.bodySemibold }}>
                Assets
              </AppText>

              <AppText
                style={{ color: theme.textPlaceholder, fontSize: 12, fontFamily: FontFamily.body }}
              >
                Devices and automation coming soon
              </AppText>
            </View>
          </Card>
        )}
      </ScrollView>
    </AppShell>
  );
}
