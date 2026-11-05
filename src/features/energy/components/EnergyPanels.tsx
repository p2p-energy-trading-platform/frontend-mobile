import { useState } from 'react';
import { View } from 'react-native';

import { FilterChips } from '@/shared/components/ui/FilterChips';

import {
  balanceSources,
  exportEarned,
  insights,
  panelOptions,
  timeAxis,
  timeSeries,
  timeSeriesLegend,
  usageCategories,
  usageTotal,
} from '../constants';

import { EnergyBalanceCard } from './EnergyBalanceCard';
import { EnergyTimeSeriesCard } from './EnergyTimeSeriesCard';
import { InsightsSection } from './InsightsSection';
import { UsageByCategoryCard } from './UsageByCategoryCard';

type EnergyPanel = (typeof panelOptions)[number]['value'];

/**
 * Filter chips + the one panel they select (Figma: "Filters" + "Panel").
 * Fills the remaining screen height; the chips bleed to the screen edges, the panel keeps the gutter.
 */
export function EnergyPanels() {
  const [panel, setPanel] = useState<EnergyPanel>('timeSeries');

  return (
    <View className="flex-1 gap-3">
      <FilterChips options={panelOptions} value={panel} onChange={setPanel} />

      <View className="flex-1 px-6">
        {panel === 'timeSeries' ? (
          <EnergyTimeSeriesCard
            series={timeSeries}
            axis={timeAxis}
            legend={timeSeriesLegend}
            fill
          />
        ) : null}

        {panel === 'balance' ? (
          <EnergyBalanceCard sources={balanceSources} footer={exportEarned} fill />
        ) : null}

        {panel === 'usage' ? (
          <UsageByCategoryCard total={usageTotal} categories={usageCategories} fill />
        ) : null}

        {panel === 'insights' ? <InsightsSection insights={insights} fill /> : null}
      </View>
    </View>
  );
}
