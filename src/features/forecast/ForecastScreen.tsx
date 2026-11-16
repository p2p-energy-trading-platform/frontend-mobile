import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import Svg, { Circle, Defs, Line, Path, Stop, LinearGradient } from 'react-native-svg';

import { bandPath, seriesToPoints, smoothPath } from '@/features/energy/chart-utils';
import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import {
  forecastControls,
  forecastInsights,
  forecastSlots,
  forecastStats,
  priceDrivers,
} from './constants';

const chartWidth = 340;
const chartHeight = 170;

function StatTile({ label, value, hint }: { label: string; value: string; hint: string }) {
  const { theme } = useTheme();
  return (
    <Card style={{ flex: 1, minHeight: 86, padding: 10 }}>
      <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</AppText>
      <AppText style={{ fontFamily: FontFamily.mono, fontSize: 13, marginTop: 7 }}>{value}</AppText>
      <AppText style={{ color: theme.textTertiary, fontSize: 9, marginTop: 4 }}>{hint}</AppText>
    </Card>
  );
}

function ForecastChart({ observedOverlay }: { observedOverlay: boolean }) {
  const { theme } = useTheme();
  const forecast = forecastSlots.map((slot) => slot.price);
  const observed = forecastSlots.map((slot) => slot.observed);
  const upper = forecastSlots.map((slot) => slot.price + slot.confidence);
  const lower = forecastSlots.map((slot) => slot.price - slot.confidence);
  const allValues = [...upper, ...lower];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const normalize = (values: readonly number[]) =>
    values.map((value) => ((value - min) / (max - min)) * (chartHeight - 22));
  const forecastPoints = seriesToPoints(normalize(forecast), chartWidth, chartHeight, 10);
  const observedPoints = seriesToPoints(normalize(observed), chartWidth, chartHeight, 10);
  const upperPoints = seriesToPoints(normalize(upper), chartWidth, chartHeight, 10);
  const lowerPoints = seriesToPoints(normalize(lower), chartWidth, chartHeight, 10);
  const nowX = forecastPoints[17]?.x ?? chartWidth / 3;

  return (
    <View>
      <Svg height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
        <Defs>
          <LinearGradient id="confidence-band" x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor={theme.chart[0]} stopOpacity="0.2" />
            <Stop offset="1" stopColor={theme.chart[0]} stopOpacity="0.04" />
          </LinearGradient>
        </Defs>
        <Path d={bandPath(upperPoints, lowerPoints)} fill="url(#confidence-band)" />
        <Line
          stroke={theme.textPlaceholder}
          strokeDasharray="4 4"
          x1={nowX}
          x2={nowX}
          y1="4"
          y2={chartHeight - 8}
        />
        <Path
          d={smoothPath(forecastPoints)}
          fill="none"
          stroke={theme.chart[0]}
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        {observedOverlay ? (
          <Path
            d={smoothPath(observedPoints)}
            fill="none"
            stroke={theme.chart[1]}
            strokeDasharray="5 4"
            strokeWidth="2"
          />
        ) : null}
        <Circle cx={nowX} cy={forecastPoints[17]?.y ?? 0} fill={theme.chart[0]} r="4" />
      </Svg>
      <View className="flex-row justify-between">
        {['00:00', '06:00', '12:00', '18:00', '23:30'].map((label) => (
          <AppText key={label} style={{ color: theme.textPlaceholder, fontSize: 9 }}>
            {label}
          </AppText>
        ))}
      </View>
      <View className="mt-1 flex-row justify-between">
        {['AED 0.70', 'AED 0.50', 'AED 0.30'].map((label) => (
          <AppText key={label} style={{ color: theme.textPlaceholder, fontSize: 9 }}>
            {label}
          </AppText>
        ))}
      </View>
      <View className="mt-3 flex-row flex-wrap gap-3">
        <View className="flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.chart[0] }} />
          <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>Forecast</AppText>
        </View>
        {observedOverlay ? (
          <View className="flex-row items-center gap-1">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.chart[1] }} />
            <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>Observed</AppText>
          </View>
        ) : null}
        <View className="flex-row items-center gap-1">
          <View className="h-2 w-2 rounded-sm" style={{ backgroundColor: `${theme.chart[0]}55` }} />
          <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>Confidence band</AppText>
        </View>
        <AppText style={{ color: theme.textTertiary, fontSize: 10 }}>│ Now</AppText>
      </View>
    </View>
  );
}

function priceTone(price: number, theme: ReturnType<typeof useTheme>['theme']) {
  if (price <= 0.32)
    return { background: theme.feedback.success.background, text: theme.feedback.success.text };
  if (price <= 0.45) return { background: theme.surfaceSecondary, text: theme.textSecondary };
  if (price <= 0.56)
    return { background: theme.feedback.warning.background, text: theme.feedback.warning.text };
  return { background: theme.feedback.error.background, text: theme.feedback.error.text };
}

export default function ForecastScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [property, setProperty] = useState<string>(forecastControls.property[0]);
  const [zone, setZone] = useState<string>(forecastControls.zone[0]);
  const [issued, setIssued] = useState<string>(forecastControls.issued[0]);
  const [observedOverlay, setObservedOverlay] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const options = useMemo(
    () => ({
      property: forecastControls.property.map((value) => ({ label: value, value })),
      zone: forecastControls.zone.map((value) => ({ label: value, value })),
      issued: forecastControls.issued.map((value) => ({ label: value, value })),
    }),
    [],
  );

  const openTrade = (index: number) => {
    setSelectedSlot(index);
    router.push({
      pathname: '/(tabs)/trade',
      params: { slot: forecastSlots[index]?.label },
    } as Href);
  };

  return (
    <AppShell initials="SW" unreadCount={2}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 14,
          paddingBottom: 26,
          paddingHorizontal: 24,
          paddingTop: 14,
        }}
      >
        <View>
          <AppText style={{ fontFamily: FontFamily.heading, fontSize: 24 }}>
            24-Hour Price Forecast
          </AppText>
          <AppText style={{ color: theme.textSecondary, fontSize: 12, marginTop: 5 }}>
            Dubai South · GX-M5 · GST · 30-minute slots
          </AppText>
          <AppText style={{ color: theme.textTertiary, fontSize: 11, marginTop: 3 }}>
            Updated 08:30 GST · 3h 30m ago
          </AppText>
        </View>
        <Card>
          <View className="gap-2">
            <FilterDropdown
              accessibilityLabel="Property"
              options={options.property}
              value={property}
              onChange={setProperty}
            />
            <FilterDropdown
              accessibilityLabel="Grid zone"
              options={options.zone}
              value={zone}
              onChange={setZone}
            />
            <FilterDropdown
              accessibilityLabel="Forecast issued"
              options={options.issued}
              value={issued}
              onChange={setIssued}
            />
            <View className="flex-row items-center justify-between pt-1">
              <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>
                Observed overlay
              </AppText>
              <Switch
                onValueChange={setObservedOverlay}
                thumbColor={theme.surface}
                trackColor={{ false: theme.switchBackground, true: theme.accent }}
                value={observedOverlay}
              />
            </View>
          </View>
        </Card>
        <View className="flex-row gap-2">
          <StatTile
            hint={forecastStats.low.hint}
            label="Daily low"
            value={forecastStats.low.value}
          />
          <StatTile
            hint={forecastStats.high.hint}
            label="Daily high"
            value={forecastStats.high.value}
          />
          <StatTile
            hint={forecastStats.average.hint}
            label="Daily average"
            value={forecastStats.average.value}
          />
        </View>
        <View className="flex-row gap-2">
          <StatTile
            hint={forecastStats.sell.price}
            label="Best sell window"
            value={forecastStats.sell.time}
          />
          <StatTile
            hint={forecastStats.buy.price}
            label="Best buy window"
            value={forecastStats.buy.time}
          />
        </View>
        <Card>
          <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>
            Price forecast
          </AppText>
          <View className="mt-3">
            <ForecastChart observedOverlay={observedOverlay} />
          </View>
        </Card>
        <Card>
          <View className="flex-row items-center justify-between">
            <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>
              Slot heatmap
            </AppText>
            <AppText style={{ color: theme.textTertiary, fontSize: 10 }}>Tap to trade</AppText>
          </View>
          <View className="mt-3 flex-row flex-wrap gap-1">
            {forecastSlots.map((slot, index) => {
              const tone = priceTone(slot.price, theme);
              return (
                <Pressable
                  key={slot.label}
                  accessibilityLabel={`Trade ${slot.label}`}
                  className="h-9"
                  onPress={() => openTrade(index)}
                  style={{
                    backgroundColor: tone.background,
                    borderColor: selectedSlot === index ? theme.text : 'transparent',
                    borderRadius: 6,
                    borderWidth: 1,
                    width: '5.9%',
                  }}
                >
                  <AppText
                    style={{
                      color: tone.text,
                      fontFamily: FontFamily.mono,
                      fontSize: 8,
                      textAlign: 'center',
                      marginTop: 10,
                    }}
                  >
                    {slot.price.toFixed(2)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          <View className="mt-3 flex-row flex-wrap gap-3">
            {[
              ['Cheap', theme.feedback.success.background],
              ['Mid', theme.surfaceSecondary],
              ['High', theme.feedback.warning.background],
              ['Peak', theme.feedback.error.background],
            ].map(([label, color]) => (
              <View key={label} className="flex-row items-center gap-1">
                <View className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</AppText>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>
            Key price drivers
          </AppText>
          <View className="mt-2">
            {priceDrivers.map(([label, value, explanation]) => (
              <View
                key={label}
                className="flex-row items-center gap-3 border-b py-3"
                style={{ borderColor: theme.divider }}
              >
                <Icon
                  color={theme.accent}
                  name={
                    label === 'Solar generation'
                      ? 'sun'
                      : label === 'Grid demand'
                        ? 'trending-up'
                        : label === 'Temperature'
                          ? 'sun'
                          : 'bolt'
                  }
                  size={17}
                />
                <View className="flex-1">
                  <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 12 }}>
                    {label}
                  </AppText>
                  <AppText style={{ color: theme.textSecondary, fontSize: 10, marginTop: 2 }}>
                    {explanation}
                  </AppText>
                </View>
                <Chip label={value} tone="success" />
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>Insights</AppText>
          <View className="mt-2 gap-3">
            {forecastInsights.map((insight) => (
              <View key={insight} className="flex-row gap-2">
                <Icon color={theme.accent} name="chevron-right" size={14} />
                <AppText
                  style={{ color: theme.textSecondary, flex: 1, fontSize: 12, lineHeight: 18 }}
                >
                  {insight}
                </AppText>
              </View>
            ))}
          </View>
        </Card>
        <AppText style={{ color: theme.textTertiary, fontSize: 10, lineHeight: 15 }}>
          Forecasts are estimates based on market conditions and may change. Prices shown are
          indicative and not guaranteed. Always review the latest slot price before placing an
          order.
        </AppText>
      </ScrollView>
    </AppShell>
  );
}
