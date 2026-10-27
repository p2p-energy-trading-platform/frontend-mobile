import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { areaPath, smoothPath, type Point } from '../chart-utils';
import type { TimeSeries } from '../types';

const HEIGHT = 150;
const PLOT_TOP = 6;
const PLOT_BOTTOM = 146;
const Y_MAX = 2; // kW

type EnergyTimeSeriesChartProps = {
  series: TimeSeries;
  peakIndex: number;
};

export function EnergyTimeSeriesChart({ series, peakIndex }: EnergyTimeSeriesChartProps) {
  const { theme } = useTheme();
  const [width, setWidth] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const toPoints = (values: number[]): Point[] =>
    values.map((v, i) => ({
      x: (i / (values.length - 1)) * width,
      y: PLOT_BOTTOM - (Math.min(v, Y_MAX) / Y_MAX) * (PLOT_BOTTOM - PLOT_TOP),
    }));

  const [exportedColor, , generatedColor, consumedColor] = theme.chart;

  if (width === 0 || series.generated.length < 2) {
    return <View onLayout={onLayout} style={{ height: HEIGHT }} />;
  }

  const generated = toPoints(series.generated);
  const consumed = toPoints(series.consumed);
  const exported = toPoints(series.exported);
  const peak = generated[peakIndex];
  if (!peak) {
    return <View onLayout={onLayout} style={{ height: HEIGHT }} />;
  }

  return (
    <View onLayout={onLayout} style={{ height: HEIGHT }}>
      <Svg width={width} height={HEIGHT}>
        <Defs>
          <LinearGradient id="generatedFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={generatedColor} stopOpacity={0.35} />
            <Stop offset="1" stopColor={generatedColor} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        {/* grid */}
        <Line
          x1={0}
          x2={width}
          y1={PLOT_TOP}
          y2={PLOT_TOP}
          stroke={theme.border}
          strokeDasharray="3,4"
        />
        <Line x1={0} x2={width} y1={76} y2={76} stroke={theme.border} strokeDasharray="3,4" />
        <Line x1={0} x2={width} y1={PLOT_BOTTOM} y2={PLOT_BOTTOM} stroke={theme.border} />

        {/* generated */}
        <Path d={areaPath(generated, PLOT_BOTTOM)} fill="url(#generatedFill)" />
        <Path d={smoothPath(generated)} stroke={generatedColor} strokeWidth={2} fill="none" />

        {/* consumed (dotted) */}
        <Path
          d={smoothPath(consumed)}
          stroke={consumedColor}
          strokeWidth={2}
          strokeDasharray="0.1,5"
          strokeLinecap="round"
          fill="none"
        />

        {/* exported */}
        <Path d={smoothPath(exported)} stroke={exportedColor} strokeWidth={2} fill="none" />

        {/* peak marker */}
        <Line
          x1={peak.x}
          x2={peak.x}
          y1={0}
          y2={PLOT_BOTTOM}
          stroke={theme.textPlaceholder}
          strokeDasharray="3,3"
        />
        <Circle
          cx={peak.x}
          cy={peak.y}
          r={4}
          fill={generatedColor}
          stroke={theme.surface}
          strokeWidth={2}
        />
      </Svg>
    </View>
  );
}
