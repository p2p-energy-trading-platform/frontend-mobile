import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { statusFilterOptions, typeFilterOptions } from '../constants';
import { useWalletHistory } from '../hooks';
import { transactionsToCsv } from '../utils';

import { TransactionRow } from './TransactionRow';

export function TransactionHistory({ onExport }: { onExport: (csv: string) => void }) {
  const { theme } = useTheme();
  const { query, setQuery, type, setType, status, setStatus, transactions } = useWalletHistory();

  return (
    <Card compact>
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <AppText className="font-body-semibold text-base">Transaction history</AppText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Export filtered transactions as CSV"
            onPress={() => onExport(transactionsToCsv(transactions))}
            className="h-9 w-9 items-center justify-center rounded-xl border"
            style={{ borderColor: theme.border, backgroundColor: theme.surface }}
          >
            <Icon name="download" size={17} color={theme.textSecondary} />
          </Pressable>
        </View>

        <View className="relative justify-center">
          <View className="absolute left-3 z-10">
            <Icon name="search" size={17} color={theme.textTertiary} />
          </View>
          <Input
            accessibilityLabel="Search transactions"
            placeholder="Search transactions"
            value={query}
            onChangeText={setQuery}
            className="h-10 py-2 pl-10 text-sm"
            returnKeyType="search"
          />
        </View>

        <View className="flex-row gap-2">
          <FilterDropdown
            accessibilityLabel="Transaction type"
            value={type}
            options={typeFilterOptions}
            onChange={setType}
          />
          <FilterDropdown
            accessibilityLabel="Transaction status"
            value={status}
            options={statusFilterOptions}
            onChange={setStatus}
          />
        </View>

        {transactions.length > 0 ? (
          <View
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: theme.border }}
          >
            {transactions.map((transaction, index) => (
              <View key={transaction.id}>
                {index > 0 ? (
                  <View className="mx-3.5 h-px" style={{ backgroundColor: theme.borderSubtle }} />
                ) : null}
                <TransactionRow transaction={transaction} />
              </View>
            ))}
          </View>
        ) : (
          <AppText className="py-8 text-center text-sm" style={{ color: theme.textTertiary }}>
            No transactions found. Try another search or filter.
          </AppText>
        )}
      </View>
    </Card>
  );
}
