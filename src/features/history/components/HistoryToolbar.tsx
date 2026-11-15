import { Pressable, Text, View } from 'react-native';

import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { tradeStatusOptions } from '../constants';
import type { TradeStatusFilter } from '../types';

type HistoryToolbarProps = {
  status: TradeStatusFilter;
  onStatusChange: (status: TradeStatusFilter) => void;
  /** e.g. "1–5 of 12 · Page 1 of 3" */
  summary: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

/** Filter button + range text + prev / next pager (Figma: History controls). */
export function HistoryToolbar({
  status,
  onStatusChange,
  summary,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: HistoryToolbarProps) {
  const { theme } = useTheme();

  return (
    <View className="h-9 flex-row items-center justify-between">
      <FilterDropdown
        label="Filter"
        options={tradeStatusOptions}
        value={status}
        onChange={onStatusChange}
        accessibilityLabel="Trade status filter"
      />

      <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
        {summary}
      </Text>

      <View className="flex-row items-center gap-1">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          accessibilityState={{ disabled: !canGoPrevious }}
          disabled={!canGoPrevious}
          onPress={onPrevious}
          className={`h-8 w-8 items-center justify-center rounded-[10px] border ${
            canGoPrevious ? '' : 'opacity-40'
          }`}
          style={{ borderColor: theme.border }}
        >
          <Icon name="chevron-left" size={16} color={theme.text} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next page"
          accessibilityState={{ disabled: !canGoNext }}
          disabled={!canGoNext}
          onPress={onNext}
          className={`h-8 w-8 items-center justify-center rounded-[10px] border ${
            canGoNext ? '' : 'opacity-40'
          }`}
          style={{ borderColor: theme.border }}
        >
          <Icon name="chevron-right" size={16} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}
