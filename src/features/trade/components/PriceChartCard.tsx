import { useState } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { marketPairLabel, timeframes } from '../constants';
import { useCandles } from '../hooks';
import type { Timeframe } from '../types';
import { CandlestickChart } from './CandlestickChart';

const timeframeOptions = timeframes.map((item) => ({ label: item, value: item }));

export function PriceChartCard() {
  const { theme } = useTheme();
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const candles = useCandles(timeframe);

  return (
    <Card>
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <AppText className="text-sm" style={{ fontFamily: FontFamily.bodySemibold }}>
            {marketPairLabel}
          </AppText>
          <AppText className="text-xs" style={{ color: theme.textTertiary }}>
            Candlestick
          </AppText>
        </View>
      </View>

      <SegmentedControl
        size="sm"
        options={timeframeOptions}
        value={timeframe}
        onChange={setTimeframe}
      />

      <View className="mt-3">
        <CandlestickChart candles={candles} timeframe={timeframe} />
      </View>
    </Card>
  );
}
