import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { getPeak } from '../chart-utils';
import type { ChartColor, TimeSeries } from '../types';

import { EnergyTimeSeriesChart } from './EnergyTimeSeriesChart';

type EnergyTimeSeriesCardProps = {
  series: TimeSeries;
  axis: readonly string[];
  legend: readonly { label: string; color: ChartColor }[];
};

export function EnergyTimeSeriesCard({ series, axis, legend }: EnergyTimeSeriesCardProps) {
  const { theme } = useTheme();
  const peak = getPeak(series.generated);

  const caption = {
    color: theme.textPlaceholder,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: FontFamily.body,
  } as const;

  return (
    <Card>
      <View className="gap-4">
        <View className="gap-0.5">
          <AppText style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}>
            Energy time series
          </AppText>

          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: FontFamily.body,
            }}
          >
            Peak {peak.value.toFixed(1)} kW at {peak.time}
          </AppText>
        </View>

        <EnergyTimeSeriesChart series={series} peakIndex={peak.index} />

        <View className="flex-row justify-between">
          {axis.map((label) => (
            <AppText key={label} style={caption}>
              {label}
            </AppText>
          ))}
        </View>

        <View className="flex-row items-center gap-4">
          {legend.map((item) => (
            <View key={item.label} className="flex-row items-center gap-1.5">
              <View
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: theme.chart[item.color] }}
              />

              <AppText
                style={{
                  color: theme.textSecondary,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: FontFamily.body,
                }}
              >
                {item.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
