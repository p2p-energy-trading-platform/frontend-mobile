import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { TRADES_PAGE_SIZE, trades } from '../constants';
import type { TradeStatusFilter } from '../types';
import { paginate } from '../utils';

import { HistoryToolbar } from './HistoryToolbar';
import { TradeCard } from './Tradecard';

/** Trades tab: status filter + pager + the page of trade cards. */
export function TradesTab() {
  const { theme } = useTheme();

  const [status, setStatus] = useState<TradeStatusFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (status === 'all' ? trades : trades.filter((trade) => trade.status === status)),
    [status],
  );

  const current = paginate(filtered, page, TRADES_PAGE_SIZE);

  const summary =
    current.total === 0
      ? 'No trades'
      : `${current.from}–${current.to} of ${current.total} · Page ${current.page} of ${current.totalPages}`;

  const handleStatusChange = (next: TradeStatusFilter) => {
    setStatus(next);
    setPage(1);
  };

  return (
    <View className="flex-1 gap-3 pt-4">
      <HistoryToolbar
        status={status}
        onStatusChange={handleStatusChange}
        summary={summary}
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
          current.items.map((trade) => <TradeCard key={trade.id} trade={trade} />)
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
    </View>
  );
}
