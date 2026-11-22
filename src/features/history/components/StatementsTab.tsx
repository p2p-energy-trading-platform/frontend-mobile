import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { STATEMENTS_PAGE_SIZE, statementFilterOptions, statements } from '../constants';
import type { StatementFilter, StatementRecord } from '../types';
import { formatPageSummary, paginate } from '../utils';

import { HistoryToolbar } from './HistoryToolbar';
import { StatementRow } from './StatementRow';

/** Statements tab: type filter + pager + one card listing the statements. */
export function StatementsTab() {
  const { theme } = useTheme();

  const [filter, setFilter] = useState<StatementFilter>('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (filter === 'all' ? statements : statements.filter((item) => item.kind === filter)),
    [filter],
  );

  const current = paginate(filtered, page, STATEMENTS_PAGE_SIZE);

  const handleFilterChange = (next: StatementFilter) => {
    setFilter(next);
    setPage(1);
  };

  // hook up your PDF download / share here
  const handleDownload = (_statement: StatementRecord) => {};

  return (
    <View className="flex-1 gap-3 pt-4">
      <HistoryToolbar
        filterOptions={statementFilterOptions}
        filterValue={filter}
        onFilterChange={handleFilterChange}
        filterAccessibilityLabel="Statement type filter"
        summary={formatPageSummary(current, 'No statements')}
        canGoPrevious={current.page > 1}
        canGoNext={current.page < current.totalPages}
        onPrevious={() => setPage(current.page - 1)}
        onNext={() => setPage(current.page + 1)}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
      >
        {current.items.length > 0 ? (
          <View
            className="overflow-hidden rounded-2xl border"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            {current.items.map((statement, index) => (
              <StatementRow
                key={statement.id}
                statement={statement}
                isLast={index === current.items.length - 1}
                onDownload={handleDownload}
              />
            ))}
          </View>
        ) : (
          <View
            className="items-center rounded-2xl border px-6 py-12"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
              No statements found
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
