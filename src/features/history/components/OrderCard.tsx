import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { OrderRecord, OrderStatus } from '../types';

import { SidePill } from './SidePill';
import { StatusPill, type StatusTone } from './StatusPill';

const STATUS: Record<OrderStatus, { label: string; tone: StatusTone }> = {
  open: { label: 'Open', tone: 'info' },
  partial: { label: 'Partial', tone: 'warning' },
  filled: { label: 'Filled', tone: 'success' },
  cancelled: { label: 'Cancelled', tone: 'neutral' },
};

const TYPE_LABEL = { limit: 'limit', market: 'market' } as const;

type OrderCardProps = {
  order: OrderRecord;
  onView?: (order: OrderRecord) => void;
  onCancel?: (order: OrderRecord) => void;
};

/** One order row: side + id + type + status, time + filled volume, View / Cancel actions. */
export function OrderCard({ order, onView, onCancel }: OrderCardProps) {
  const { theme } = useTheme();

  const status = STATUS[order.status];
  const cancellable = order.status === 'open' || order.status === 'partial';

  return (
    <View
      className="rounded-2xl border p-4"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      {/* Side + id + type · status */}
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-center gap-2">
          <SidePill side={order.side} />

          <Text className="font-mono text-sm leading-5" style={{ color: theme.text }}>
            {order.id}
          </Text>

          <Text className="font-body text-xs capitalize" style={{ color: theme.textDisabled }}>
            {TYPE_LABEL[order.type]}
          </Text>
        </View>

        <StatusPill label={status.label} tone={status.tone} />
      </View>

      {/* Time · filled / total */}
      <View className="mt-2 flex-row items-center justify-between">
        <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
          {order.slot} · {order.date} · {order.placedAt}
        </Text>

        <Text className="font-mono text-xs" style={{ color: theme.text }}>
          {order.filledKwh}/{order.totalKwh} kWh
        </Text>
      </View>

      {/* Actions */}
      <View className="mt-3 flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View order ${order.id}`}
          onPress={() => onView?.(order)}
          className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-1.5"
          style={{ borderColor: theme.border }}
        >
          <Icon name="visibility" size={12} color={theme.textTertiary} />

          <Text className="font-body-medium text-xs" style={{ color: theme.textTertiary }}>
            View
          </Text>
        </Pressable>

        {cancellable ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Cancel order ${order.id}`}
            onPress={() => onCancel?.(order)}
            className="flex-1 flex-row items-center justify-center gap-1.5 rounded-xl border py-1.5"
            style={{ borderColor: theme.feedback.error.border }}
          >
            <Icon name="cancel" size={12} color={theme.feedback.error.text} />

            <Text className="font-body-medium text-xs" style={{ color: theme.feedback.error.text }}>
              Cancel
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
