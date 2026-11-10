import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Line, Path, Stop } from 'react-native-svg';
import { ChevronDown } from 'lucide-react-native';

import { areaPath, smoothPath } from '@/features/energy/chart-utils';
import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { Input } from '@/shared/components/ui/Input';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import {
  availableBalance,
  bestAsk,
  bestBuyPrice,
  bestSellPrice,
  openOrderCount,
  priceChange,
  priceRanges,
  priceSeries,
  quickAmounts,
  tradeHeader,
  tradePrice,
  tradeSlots,
  type OrderType,
  type PriceRange,
  type TradeSide,
} from './constants';

const CHART_WIDTH = 320;
const CHART_HEIGHT = 112;
const CHART_BASELINE = 104;

function Chart({ range }: { range: PriceRange }) {
  const { theme } = useTheme();
  const values = priceSeries[range];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => ({
    x: (index / (values.length - 1)) * CHART_WIDTH,
    y: 12 + ((max - value) / (max - min || 1)) * 76,
  }));
  const line = smoothPath(points);
  const fill = areaPath(points, CHART_BASELINE);
  const last = points[points.length - 1];

  if (!last) return null;

  return (
    <Svg height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} width="100%">
      <Defs>
        <LinearGradient id="trade-chart-fill" x1="0" x2="0" y1="0" y2="1">
          <Stop offset="0" stopColor={theme.accent} stopOpacity="0.22" />
          <Stop offset="1" stopColor={theme.accent} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Path d={fill} fill="url(#trade-chart-fill)" />
      <Line
        stroke={theme.textPlaceholder}
        strokeDasharray="4 4"
        strokeWidth="1"
        x1={last.x}
        x2={last.x}
        y1="8"
        y2={CHART_BASELINE}
      />
      <Path d={line} fill="none" stroke={theme.accent} strokeLinecap="round" strokeWidth="2.5" />
      <Circle cx={last.x} cy={last.y} fill={theme.surface} r="5" stroke={theme.accent} strokeWidth="2.5" />
    </Svg>
  );
}

function SelectableChip({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className="rounded-full border px-3 py-1.5"
      onPress={onPress}
      style={{ backgroundColor: active ? theme.surfaceSecondary : theme.surface, borderColor: active ? theme.text : theme.border }}
    >
      <AppText style={{ color: active ? theme.text : theme.textSecondary, fontFamily: FontFamily.bodyMedium, fontSize: 12 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

export default function TradeScreen() {
  const { theme } = useTheme();
  const [selectedSlot, setSelectedSlot] = useState(tradeSlots[0]?.value ?? '');
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  const [range, setRange] = useState<PriceRange>('1H');
  const [side, setSide] = useState<TradeSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState(String(tradePrice.toFixed(2)));

  const numericQuantity = Number(quantity);
  const numericPrice = Number(limitPrice);
  const quantityValid = Number.isFinite(numericQuantity) && numericQuantity > 0 && numericQuantity <= availableBalance;
  const priceValid = orderType === 'market' || (Number.isFinite(numericPrice) && numericPrice > 0);
  const formValid = quantityValid && priceValid;
  const effectivePrice = orderType === 'market' ? tradePrice : numericPrice;
  const estimatedTotal = numericQuantity * effectivePrice;

  const chartLabels = useMemo(() => ({ start: range === '1D' ? '00:00' : '13:00', end: 'Now' }), [range]);

  const setQuickQuantity = (amount: number | 'max') => {
    setQuantity(String(amount === 'max' ? availableBalance : amount));
  };

  return (
    <AppShell unreadCount={tradeHeader.unreadCount} initials={tradeHeader.initials}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: 12, paddingBottom: 16, paddingTop: 12 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            <PageHeader title={tradeHeader.title} subtitle={tradeHeader.subtitle} />
            <Pressable
              accessibilityRole="button"
              className="mt-3 flex-row items-center self-start rounded-full border px-3 py-2"
              onPress={() => setSlotPickerOpen((open) => !open)}
              style={{ backgroundColor: theme.surface, borderColor: theme.border }}
            >
              <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 12 }}>{selectedSlot}</AppText>
              <ChevronDown color={theme.textSecondary} size={15} style={{ marginLeft: 5 }} />
            </Pressable>
            {slotPickerOpen ? (
              <Card style={{ marginTop: 6, padding: 8 }}>
                {tradeSlots.map((slot) => (
                  <Pressable
                    key={slot.value}
                    className="rounded-lg px-3 py-2.5"
                    onPress={() => {
                      setSelectedSlot(slot.value);
                      setSlotPickerOpen(false);
                    }}
                    style={slot.value === selectedSlot ? { backgroundColor: theme.surfaceSecondary } : undefined}
                  >
                    <AppText style={{ fontSize: 13 }}>{slot.label}</AppText>
                  </Pressable>
                ))}
              </Card>
            ) : null}
          </View>

          <View className="px-6">
            <Card>
              <View className="flex-row items-start justify-between">
                <View>
                  <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Current price</AppText>
                  <View className="mt-1 flex-row items-baseline gap-2">
                    <AppText style={{ fontFamily: FontFamily.heading, fontSize: 28 }}>{tradePrice.toFixed(2)}</AppText>
                    <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>AED/kWh</AppText>
                  </View>
                </View>
                <Chip label={`+${priceChange.toFixed(2)} (7.1%)`} tone="success" dot />
              </View>
              <View className="mt-3">
                <SegmentedControl
                  options={priceRanges.map((item) => ({ label: item, value: item }))}
                  size="sm"
                  value={range}
                  onChange={setRange}
                />
              </View>
              <View className="mt-2">
                <Chart range={range} />
                <View className="flex-row justify-between">
                  <AppText style={{ color: theme.textPlaceholder, fontSize: 10 }}>{chartLabels.start}</AppText>
                  <AppText style={{ color: theme.textPlaceholder, fontSize: 10 }}>{chartLabels.end}</AppText>
                </View>
              </View>
            </Card>
          </View>

          <View className="px-6">
            <Card>
              <SegmentedControl
                options={[
                  { label: 'Buy', value: 'buy' },
                  { label: 'Sell', value: 'sell' },
                ]}
                value={side}
                onChange={setSide}
              />
              <View className="mt-3 flex-row items-center justify-between">
                <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Quantity</AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>
                  Available {availableBalance.toFixed(1)} kWh
                </AppText>
              </View>
              <Input
                keyboardType="decimal-pad"
                onChangeText={setQuantity}
                placeholder="0.0"
                style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16, marginTop: 6 }}
                value={quantity}
              />
              <View className="mt-2 flex-row gap-2">
                {quickAmounts.map((amount) => (
                  <SelectableChip key={amount} label={`${amount} kWh`} onPress={() => setQuickQuantity(amount)} />
                ))}
                <SelectableChip label="Max" onPress={() => setQuickQuantity('max')} />
              </View>

              <View className="mt-4">
                <SegmentedControl
                  options={[
                    { label: 'Limit', value: 'limit' },
                    { label: 'Market', value: 'market' },
                  ]}
                  size="sm"
                  value={orderType}
                  onChange={setOrderType}
                />
              </View>
              {orderType === 'limit' ? (
                <View className="mt-3">
                  <View className="flex-row items-center justify-between">
                    <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Limit price</AppText>
                    <Pressable onPress={() => setLimitPrice(bestAsk.toFixed(2))}>
                      <AppText style={{ color: theme.accent, fontFamily: FontFamily.bodySemibold, fontSize: 12 }}>
                        Best ask AED {bestAsk.toFixed(2)}
                      </AppText>
                    </Pressable>
                  </View>
                  <Input
                    keyboardType="decimal-pad"
                    onChangeText={setLimitPrice}
                    style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16, marginTop: 6 }}
                    value={limitPrice}
                  />
                </View>
              ) : null}

              <View className="mt-4 flex-row items-center justify-between">
                <View>
                  <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>Estimated total</AppText>
                  <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16, marginTop: 2 }}>
                    {formValid ? `AED ${estimatedTotal.toFixed(2)}` : 'AED —'}
                  </AppText>
                </View>
                <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>{selectedSlot}</AppText>
              </View>
              <Button
                disabled={!formValid}
                title={`Review ${side} order`}
                variant="accent"
                containerStyle={{ marginTop: 14 }}
              />
              {!quantityValid && quantity.length > 0 ? (
                <AppText style={{ color: theme.error, fontSize: 11, marginTop: 6 }}>
                  Enter a quantity up to {availableBalance.toFixed(1)} kWh.
                </AppText>
              ) : null}
            </Card>
          </View>

          <View className="px-6">
            <Pressable accessibilityRole="button" onPress={() => undefined}>
              <Card>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 14 }}>Open orders</AppText>
                    <Chip label={String(openOrderCount)} tone="success" semibold />
                  </View>
                  <AppText style={{ color: theme.textSecondary, fontSize: 12 }}>›</AppText>
                </View>
                <View className="mt-3 flex-row justify-between">
                  <View>
                    <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>Best sell</AppText>
                    <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 14, marginTop: 2 }}>
                      AED {bestSellPrice.toFixed(2)}
                    </AppText>
                  </View>
                  <View className="items-end">
                    <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>Best buy</AppText>
                    <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 14, marginTop: 2 }}>
                      AED {bestBuyPrice.toFixed(2)}
                    </AppText>
                  </View>
                </View>
              </Card>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}
