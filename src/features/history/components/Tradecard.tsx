import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { TradeRecord, TradeStatus } from '../types';

const STATUS_LABEL: Record<TradeStatus, string> = {
  settled: 'Settled',
  pending: 'Pending',
  failed: 'Failed',
};

type TradeCardProps = {
  trade: TradeRecord;
  onPress?: (trade: TradeRecord) => void;
};

/** One trade row: side pill + id + status, time + total, volume/price + counterparty. */
export function TradeCard({ trade, onPress }: TradeCardProps) {
  const { theme } = useTheme();

  const isSell = trade.side === 'sell';

  const side = isSell
    ? {
        label: 'Sell',
        icon: 'north-east' as const,
        background: theme.trade.sellBackground,
        color: theme.feedback.success.text,
      }
    : {
        label: 'Buy',
        icon: 'south-west' as const,
        background: theme.trade.buyBackground,
        color: theme.feedback.info.text,
      };

  const statusColors = {
    settled: theme.feedback.success,
    pending: theme.feedback.warning,
    failed: theme.feedback.error,
  }[trade.status];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${side.label} ${trade.id}, ${STATUS_LABEL[trade.status]}`}
      onPress={() => onPress?.(trade)}
      className="gap-1 rounded-2xl border p-4"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      {/* Side + id · status */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="flex-row items-center gap-0.5 rounded-full px-2 py-0.5"
            style={{ backgroundColor: side.background }}
          >
            <Icon name={side.icon} size={9} color={side.color} />

            <Text className="font-body-bold text-[10px] leading-[15px]" style={{ color: side.color }}>
              {side.label}
            </Text>
          </View>

          <Text className="font-mono text-sm leading-5" style={{ color: theme.text }}>
            {trade.id}
          </Text>
        </View>

        <View
          className="rounded-full border px-2 py-0.5"
          style={{ backgroundColor: statusColors.background, borderColor: statusColors.border }}
        >
          <Text
            className="font-body-semibold text-[10px] leading-[15px]"
            style={{ color: statusColors.icon }}
          >
            {STATUS_LABEL[trade.status]}
          </Text>
        </View>
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
