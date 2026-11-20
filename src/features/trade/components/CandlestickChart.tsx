import { useState } from 'react';
import { View } from 'react-native';
import Svg, { G, Line, Rect } from 'react-native-svg';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { Candle, Timeframe } from '../types';

const HEIGHT = 180;
const PADDING_Y = 8;

function formatTime(seconds: number, timeframe: Timeframe) {
  const date = new Date(seconds * 1000);

  return timeframe === '1D'
    ? date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export function CandlestickChart({
  candles,
  timeframe,
}: {
  candles: Candle[];
  timeframe: Timeframe;
}) {
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);

  const first = candles[0];
  const last = candles[candles.length - 1];
  if (!first || !last) return null;

  const high = Math.max(...candles.map((candle) => candle.high));
  const low = Math.min(...candles.map((candle) => candle.low));
  const range = high - low || 1;
  const y = (price: number) => PADDING_Y + ((high - price) / range) * (HEIGHT - PADDING_Y * 2);

  const slot = width / candles.length;
  const bodyWidth = Math.max(2, slot * 0.6);
  const lastColor = last.close >= last.open ? theme.accent : theme.error;

  return (
    <View accessibilityLabel={`Candlestick chart, last price ${last.close.toFixed(3)}`}>
      <View className="flex-row justify-between">
        <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
          {high.toFixed(3)}
        </AppText>
        <AppText className="text-xs" style={{ color: lastColor }}>
          Last {last.close.toFixed(3)}
        </AppText>
      </View>

      <View className="my-1" onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={HEIGHT}>
            <Line
              x1={0}
              x2={width}
              y1={y(last.close)}
              y2={y(last.close)}
              stroke={lastColor}
              strokeDasharray="4 4"
              strokeWidth={1}
            />
            {candles.map((candle, index) => {
              const up = candle.close >= candle.open;
              const color = up ? theme.accent : theme.error;
              const center = slot * index + slot / 2;
              const top = y(Math.max(candle.open, candle.close));
              const bottom = y(Math.min(candle.open, candle.close));

              return (
                <G key={candle.time}>
                  <Line
                    x1={center}
                    x2={center}
                    y1={y(candle.high)}
                    y2={y(candle.low)}
                    stroke={color}
                    strokeWidth={1}
                  />
                  <Rect
                    x={center - bodyWidth / 2}
                    y={top}
                    width={bodyWidth}
                    height={Math.max(1, bottom - top)}
                    fill={color}
                    rx={1}
                  />
                </G>
              );
            })}
          </Svg>
        ) : (
          <View style={{ height: HEIGHT }} />
        )}
      </View>

      <View className="flex-row justify-between">
        <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
          {low.toFixed(3)} · {formatTime(first.time, timeframe)}
        </AppText>
        <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
          {formatTime(last.time, timeframe)}
        </AppText>
      </View>
    </View>
  );
}
