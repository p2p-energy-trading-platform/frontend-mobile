import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { TRADES_PAGE_SIZE, tradeStatusOptions, trades } from '../constants';
import type { TradeRecord, TradeStatusFilter } from '../types';
import { formatPageSummary, paginate, tradeDetailRows } from '../utils';

import { DetailsSheet } from './DetailsSheet';
import { HistoryToolbar } from './HistoryToolbar';
import { TradeCard } from './TradeCard';

/** Trades tab: status filter + pager + the page of trade cards. */
export function TradesTab() {
  const { theme } = useTheme();

  const [status, setStatus] = useState<TradeStatusFilter>('all');
  const [page, setPage] = useState(1);

  // `selected` is kept after closing so the sheet content doesn't blank out while it slides away
  const [selected, setSelected] = useState<TradeRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(
    () => (status === 'all' ? trades : trades.filter((trade) => trade.status === status)),
    [status],
  );

  const current = paginate(filtered, page, TRADES_PAGE_SIZE);

  const handleStatusChange = (next: TradeStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  const handleOpenDetails = (trade: TradeRecord) => {
    setSelected(trade);
    setDetailsOpen(true);
  };

  return (
    <View className="flex-1 gap-3 pt-4">
      <HistoryToolbar
        filterOptions={tradeStatusOptions}
        filterValue={status}
        onFilterChange={handleStatusChange}
        filterAccessibilityLabel="Trade status filter"
        summary={formatPageSummary(current, 'No trades')}
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
          current.items.map((trade) => (
            <TradeCard key={trade.id} trade={trade} onPress={handleOpenDetails} />
          ))
        ) : (
          <View
            className="items-center rounded-2xl border px-6 py-12"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
              No trades found
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
        title={selected ? `Trade ${selected.id}` : ''}
        rows={selected ? tradeDetailRows(selected) : []}
        onClose={() => setDetailsOpen(false)}
      />
    </View>
  );
}
