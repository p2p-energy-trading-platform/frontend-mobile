import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { areaPath, smoothPath, type Point } from '../chart-utils';
import type { TimeSeries } from '../types';

/** Smallest chart height; the chart grows beyond this to fill the card. */
const MIN_HEIGHT = 150;
const PLOT_TOP = 6;
const PLOT_BOTTOM_INSET = 4; // gap between the baseline and the bottom edge
const Y_MAX = 2; // kW

type EnergyTimeSeriesChartProps = {
  series: TimeSeries;
  peakIndex: number;
};

export function EnergyTimeSeriesChart({ series, peakIndex }: EnergyTimeSeriesChartProps) {
  const { theme } = useTheme();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;

  const onLayout = (e: LayoutChangeEvent) => {
    const { width: w, height: h } = e.nativeEvent.layout;
    setSize({ width: w, height: h });
  };

  // Plot area follows the measured height so a taller chart uses the extra space.
  const plotBottom = height - PLOT_BOTTOM_INSET;
  const plotMiddle = (PLOT_TOP + plotBottom) / 2;

  const toPoints = (values: number[]): Point[] =>
    values.map((v, i) => ({
      x: (i / (values.length - 1)) * width,
      y: plotBottom - (Math.min(v, Y_MAX) / Y_MAX) * (plotBottom - PLOT_TOP),
    }));

  const [exportedColor, , generatedColor, consumedColor] = theme.chart;

  if (width === 0 || height === 0 || series.generated.length < 2) {
    return <View onLayout={onLayout} style={{ flex: 1, minHeight: MIN_HEIGHT }} />;
  }

  const generated = toPoints(series.generated);
  const consumed = toPoints(series.consumed);
  const exported = toPoints(series.exported);
  const peak = generated[peakIndex];
  if (!peak) {
    return <View onLayout={onLayout} style={{ flex: 1, minHeight: MIN_HEIGHT }} />;
  }

  return (
    <View onLayout={onLayout} style={{ flex: 1, minHeight: MIN_HEIGHT }}>
      <Svg width={width} height={height}>
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
        <Line
          x1={0}
          x2={width}
          y1={plotMiddle}
          y2={plotMiddle}
          stroke={theme.border}
          strokeDasharray="3,4"
        />
        <Line x1={0} x2={width} y1={plotBottom} y2={plotBottom} stroke={theme.border} />

        {/* generated */}
        <Path d={areaPath(generated, plotBottom)} fill="url(#generatedFill)" />
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
          y1={PLOT_TOP}
          y2={plotBottom}
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
