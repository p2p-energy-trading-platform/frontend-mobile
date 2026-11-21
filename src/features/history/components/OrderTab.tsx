import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { ORDERS_PAGE_SIZE, orderStatusOptions } from '../constants';
import { useOrdersStore } from '../store';
import type { OrderRecord, OrderStatusFilter } from '../types';
import { formatPageSummary, orderDetailRows, paginate } from '../utils';

import { DetailsSheet } from './DetailsSheet';
import { HistoryToolbar } from './HistoryToolbar';
import { OrderCard } from './OrderCard';

/** Orders tab: status filter + pager + order cards with View / Cancel. */
export function OrdersTab() {
  const { theme } = useTheme();

  // orders come from the store, so cancelling persists after the tab closes
  const items = useOrdersStore((state) => state.orders);
  const cancelOrder = useOrdersStore((state) => state.cancelOrder);

  const [status, setStatus] = useState<OrderStatusFilter>('all');
  const [page, setPage] = useState(1);

  // keep the id (not the record) so the sheet shows the latest status after a cancel;
  // it is kept after closing so the content doesn't blank out while the sheet slides away
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const selected = items.find((order) => order.id === selectedId) ?? null;

  const filtered = useMemo(
    () => (status === 'all' ? items : items.filter((order) => order.status === status)),
    [items, status],
  );

  const current = paginate(filtered, page, ORDERS_PAGE_SIZE);

  const handleStatusChange = (next: OrderStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const handleView = (target: OrderRecord) => {
    setSelectedId(target.id);
    setDetailsOpen(true);
  };

  const handleCancel = (target: OrderRecord) => {
    Alert.alert('Cancel order', `Cancel order ${target.id}?`, [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: () => cancelOrder(target.id),
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
            <OrderCard key={order.id} order={order} onView={handleView} onCancel={handleCancel} />
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

      <DetailsSheet
        visible={detailsOpen}
        title={selected ? `Order ${selected.id}` : ''}
        rows={selected ? orderDetailRows(selected) : []}
        onClose={() => setDetailsOpen(false)}
      />
    </View>
  );
}
