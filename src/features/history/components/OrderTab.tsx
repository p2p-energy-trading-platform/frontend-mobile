import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { ORDERS_PAGE_SIZE, orderStatusOptions, orders as initialOrders } from '../constants';
import type { OrderRecord, OrderStatusFilter } from '../types';
import { formatPageSummary, paginate } from '../utils';

import { HistoryToolbar } from './HistoryToolbar';
import { OrderCard } from './OrderCard';

/** Orders tab: status filter + pager + order cards with View / Cancel. */
export function OrdersTab() {
  const { theme } = useTheme();

  // replace with your API data; cancelling below only updates local state
  const [items, setItems] = useState<OrderRecord[]>(initialOrders);
  const [status, setStatus] = useState<OrderStatusFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (status === 'all' ? items : items.filter((order) => order.status === status)),
    [items, status],
  );

  const current = paginate(filtered, page, ORDERS_PAGE_SIZE);

  const handleStatusChange = (next: OrderStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const handleCancel = (target: OrderRecord) => {
    Alert.alert('Cancel order', `Cancel order ${target.id}?`, [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: () =>
          setItems((prev) =>
            prev.map((order) =>
              order.id === target.id ? { ...order, status: 'cancelled' } : order,
            ),
          ),
      },
    ]);
  };

  return (
    <View className="flex-1 gap-3 pt-4">
      <HistoryToolbar
        filterOptions={orderStatusOptions}
        filterValue={status}
        onFilterChange={handleStatusChange}
        filterAccessibilityLabel="Order status filter"
        summary={formatPageSummary(current, 'No orders')}
        canGoPrevious={current.page > 1}
        canGoNext={current.page < current.totalPages}
        onPrevious={() => setPage(current.page - 1)}
        onNext={() => setPage(current.page + 1)}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-2 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {current.items.length > 0 ? (
          current.items.map((order) => (
            <OrderCard key={order.id} order={order} onCancel={handleCancel} />
          ))
        ) : (
          <View
            className="items-center rounded-2xl border px-6 py-12"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
              No orders found
            </Text>

            <Text
              className="mt-1 text-center font-body text-xs"
              style={{ color: theme.textTertiary }}
            >
              Try a different filter.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
