import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { TradeRecord, TradeStatus } from '../types';

import { SidePill } from './SidePill';
import { StatusPill, type StatusTone } from './StatusPill';

const STATUS: Record<TradeStatus, { label: string; tone: StatusTone }> = {
  settled: { label: 'Settled', tone: 'success' },
  pending: { label: 'Pending', tone: 'warning' },
  failed: { label: 'Failed', tone: 'error' },
};

type TradeCardProps = {
  trade: TradeRecord;
  onPress?: (trade: TradeRecord) => void;
};

/** One trade row: side pill + id + status, time + total, volume/price + counterparty. */
export function TradeCard({ trade, onPress }: TradeCardProps) {
  const { theme } = useTheme();

  const status = STATUS[trade.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${trade.side === 'sell' ? 'Sell' : 'Buy'} ${trade.id}, ${status.label}`}
      onPress={() => onPress?.(trade)}
      className="gap-1 rounded-2xl border p-4"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      {/* Side + id · status */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <SidePill side={trade.side} />

          <Text className="font-mono text-sm leading-5" style={{ color: theme.text }}>
            {trade.id}
          </Text>
        </View>

        <StatusPill label={status.label} tone={status.tone} />
      </View>

      {/* Time · total */}
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="font-body-medium text-xs" style={{ color: theme.textTertiary }}>
          {trade.slot} · {trade.date} · {trade.placedAt}
        </Text>

        <Text className="font-mono text-xs" style={{ color: theme.text }}>
          {trade.total}
        </Text>
      </View>

      {/* Volume · price · counterparty */}
      <View className="flex-row items-center justify-between gap-3">
        <Text className="font-body-medium text-xs" style={{ color: theme.textDisabled }}>
          {trade.energy} · {trade.price}
        </Text>

        <Text
          numberOfLines={1}
          className="shrink font-body-medium text-xs"
          style={{ color: theme.textDisabled }}
        >
          {trade.role} · {trade.zone}
        </Text>
      </View>
    </Pressable>
  );
}
