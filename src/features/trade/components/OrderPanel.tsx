import { useState } from 'react';
import { Alert, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { FilterChips } from '@/shared/components/ui/FilterChips';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';
import { formatAed } from '@/shared/utils/format';

import { orderQuote, priceUnitLabel } from '../constants';
import type { OrderSide, OrderType } from '../types';
import { calculateOrder } from '../utils';

const sideOptions = [
  { label: 'Buy Energy', value: 'buy' },
  { label: 'Sell Energy', value: 'sell' },
] as const;

const orderTypeOptions = [
  { label: 'Market Order', value: 'market' },
  { label: 'Limit Order', value: 'limit' },
] as const;

const presetOptions = orderQuote.amountPresets.map((preset) => ({
  label: `${preset} kWh`,
  value: String(preset),
}));

function FieldLabel({ children }: { children: string }) {
  const { theme } = useTheme();

  return (
    <AppText
      className="mb-2 text-xs"
      style={{ color: theme.textSecondary, fontFamily: FontFamily.bodyMedium }}
    >
      {children}
    </AppText>
  );
}

function UnitInput({
  value,
  onChangeText,
  unit,
  editable = true,
  accessibilityLabel,
}: {
  value: string;
  onChangeText?: (value: string) => void;
  unit: string;
  editable?: boolean;
  accessibilityLabel: string;
}) {
  const { theme } = useTheme();

  return (
    <View className="justify-center">
      <Input
        accessibilityLabel={accessibilityLabel}
        keyboardType="decimal-pad"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        className="h-12 rounded-xl border px-4 pr-20"
        style={{
          fontFamily: FontFamily.bodySemibold,
          backgroundColor: editable ? theme.inputBackground : theme.surfaceAlt,
          color: editable ? theme.text : theme.textTertiary,
        }}
      />
      <AppText className="absolute right-4 text-xs" style={{ color: theme.textTertiary }}>
        {unit}
      </AppText>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  const { theme } = useTheme();
  const font = strong ? FontFamily.bodySemibold : FontFamily.body;

  return (
    <View className="flex-row justify-between">
      <AppText
        className={strong ? 'text-sm' : 'text-xs'}
        style={{ color: strong ? theme.text : theme.textSecondary, fontFamily: font }}
      >
        {label}
      </AppText>
      <AppText className={strong ? 'text-sm' : 'text-xs'} style={{ fontFamily: font }}>
        {value}
      </AppText>
    </View>
  );
}

export function OrderPanel({ slotLabel }: { slotLabel: string }) {
  const { theme } = useTheme();
  const [side, setSide] = useState<OrderSide>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [amount, setAmount] = useState(orderQuote.defaultAmount);
  const [price, setPrice] = useState(orderQuote.defaultPrice);

  const order = calculateOrder({ side, orderType, amount, price, quote: orderQuote });
  const buying = side === 'buy';

  const reviewOrder = () => {
    Alert.alert(
      `${buying ? 'Buy' : 'Sell'} ${order.quantity} kWh`,
      `${orderType === 'market' ? 'Market' : 'Limit'} order at ${order.unitPrice.toFixed(3)} ${priceUnitLabel}\nDelivery slot ${slotLabel}\n${buying ? 'Total cost' : 'Estimated proceeds'} ${formatAed(order.total)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place order',
          // TODO(api): POST the order to the matching engine once the endpoint is ready.
          onPress: () => Alert.alert('Not available yet', 'Order placement is coming soon.'),
        },
      ],
    );
  };

  return (
    <Card>
      <SegmentedControl options={sideOptions} value={side} onChange={setSide} />

      <View
        className="mt-4 flex-row items-center justify-between rounded-xl p-3"
        style={{ backgroundColor: theme.surfaceAlt }}
      >
        <View className="flex-row items-center gap-2">
          <Icon
            name={buying ? 'account-balance-wallet' : 'bolt'}
            size={16}
            color={buying ? theme.accent : theme.error}
          />
          <AppText className="text-xs" style={{ color: theme.textSecondary }}>
            {buying ? 'Available Balance' : 'Available Energy'}
          </AppText>
        </View>
        <AppText className="text-sm" style={{ fontFamily: FontFamily.bodySemibold }}>
          {buying ? formatAed(orderQuote.availableBalance) : `${orderQuote.availableEnergyKwh} kWh`}
        </AppText>
      </View>

      <View className="mt-4">
        <FieldLabel>Order Type</FieldLabel>
        <SegmentedControl options={orderTypeOptions} value={orderType} onChange={setOrderType} />
      </View>

      <View className="mt-4">
        <FieldLabel>Amount (kWh)</FieldLabel>
        <UnitInput
          accessibilityLabel="Amount in kilowatt-hours"
          value={amount}
          onChangeText={setAmount}
          unit="kWh"
        />
        <View className="mt-2">
          <FilterChips options={presetOptions} value={amount} onChange={setAmount} gutter={0} />
        </View>
      </View>

      <View className="mt-4">
        <FieldLabel>{`Price (${priceUnitLabel})`}</FieldLabel>
        <UnitInput
          accessibilityLabel="Price per kilowatt-hour"
          value={orderType === 'market' ? 'Best market price' : price}
          onChangeText={setPrice}
          editable={orderType === 'limit'}
          unit={priceUnitLabel}
        />
      </View>

      <View className="mt-4 gap-2 border-t pt-4" style={{ borderTopColor: theme.borderSubtle }}>
        <SummaryRow label="Delivery slot" value={slotLabel} />
        <SummaryRow label="Subtotal" value={formatAed(order.subtotal)} />
        <SummaryRow
          label={`Platform Fee (${orderQuote.feeRate * 100}%)`}
          value={formatAed(order.fee)}
        />
        <SummaryRow
          strong
          label={buying ? 'Total Cost' : 'Estimated Proceeds'}
          value={formatAed(order.subtotal > 0 ? order.total : 0)}
        />
      </View>

      {order.error ? (
        <AppText accessibilityRole="alert" className="mt-3 text-xs" style={{ color: theme.error }}>
          {order.error}
        </AppText>
      ) : null}

      <Button
        accessibilityLabel={`${buying ? 'Buy' : 'Sell'} ${order.valid ? order.quantity : 0} kilowatt-hours`}
        title={`${buying ? 'Buy' : 'Sell'} ${order.valid ? order.quantity : 0} kWh`}
        variant={buying ? 'accent' : 'destructive'}
        disabled={!order.valid}
        onPress={reviewOrder}
        containerStyle={{ marginTop: 16 }}
      />

      <AppText className="mt-3 text-center text-xs" style={{ color: theme.textTertiary }}>
        Orders are matched with verified participants in your energy zone.
      </AppText>
    </Card>
  );
}
