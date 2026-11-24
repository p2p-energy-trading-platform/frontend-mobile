import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { StatusPill, type StatusTone } from '@/shared/components/ui/StatusPill';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { formatAed } from '@/shared/utils/format';

import { transactionIcons } from '../constants';
import type { TransactionStatus, WalletTransaction } from '../types';

const statusTone: Record<TransactionStatus, StatusTone> = {
  Settled: 'success',
  Pending: 'warning',
  Failed: 'error',
};

export function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const { theme } = useTheme();
  const failed = transaction.status === 'Failed';
  const positive = transaction.amount >= 0;
  const credit = positive && !failed;

  const amountColor = failed
    ? theme.textTertiary
    : positive
      ? theme.feedback.success.text
      : theme.error;

  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{
          backgroundColor: credit ? theme.feedback.success.background : theme.surfaceSecondary,
        }}
      >
        <Icon
          name={transactionIcons[transaction.type]}
          size={17}
          color={credit ? theme.feedback.success.icon : theme.textSecondary}
        />
      </View>

      <View className="min-w-0 flex-1 gap-0.5">
        <AppText numberOfLines={2} className="font-body-semibold text-sm">
          {transaction.title}
        </AppText>
        <AppText numberOfLines={1} className="text-xs" style={{ color: theme.textPlaceholder }}>
          {transaction.date} · {transaction.reference}
        </AppText>
      </View>

      <View className="items-end gap-1">
        <AppText
          className={failed ? 'font-mono text-sm line-through' : 'font-mono text-sm'}
          style={{ color: amountColor }}
        >
          {positive ? '+' : '−'}
          {formatAed(Math.abs(transaction.amount))}
        </AppText>
        <StatusPill label={transaction.status} tone={statusTone[transaction.status]} />
      </View>
    </View>
  );
}
