import { Pressable, View } from 'react-native';

import { StatusPill } from '@/features/history/components/StatusPill';
import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import {
  paymentMethodOptions,
  statusFilterOptions,
  transactionIcons,
  typeFilterOptions,
  walletStats,
} from '../constants';
import { usePaymentMethods, useWalletHistory } from '../hooks';
import type { PaymentCard, TransactionStatus, WalletTransaction } from '../types';
import { transactionsToCsv } from '../utils';

const statusTone: Record<TransactionStatus, 'success' | 'warning' | 'error'> = {
  Settled: 'success',
  Pending: 'warning',
  Failed: 'error',
};

export function BalanceCard() {
  const { theme } = useTheme();
  return (
    <Card>
      <View className="gap-4">
        <AppText
          className="text-[13px] leading-[18px] text-secondary"
          style={{ color: theme.textSecondary }}
        >
          Available balance
        </AppText>
        <View className="flex-row items-baseline gap-2">
          <AppText className="font-mono text-[38px] leading-[44px]" style={{ color: theme.accent }}>
            284.50
          </AppText>
          <AppText className="text-base leading-[22px]" style={{ color: theme.textPlaceholder }}>
            AED
          </AppText>
        </View>
        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />
        <View className="flex-row justify-between">
          {walletStats.map((stat, index) => (
            <View key={stat.label} className="flex-1 gap-0.5">
              <AppText className="text-[11px] leading-[15px]" style={{ color: theme.textTertiary }}>
                {stat.label}
              </AppText>
              <AppText
                className="font-mono text-[13px] leading-[18px]"
                style={{ color: index === 0 ? theme.warning : theme.text }}
              >
                {stat.value}
              </AppText>
              <AppText
                className="text-[10px] leading-[14px]"
                style={{ color: theme.textPlaceholder }}
              >
                {stat.caption}
              </AppText>
            </View>
          ))}
        </View>
        <AppText className="text-[11px] leading-[15px]" style={{ color: theme.textTertiary }}>
          1 GridX credit = AED 1.00
        </AppText>
      </View>
    </Card>
  );
}

export function TransactionHistory({ onExport }: { onExport: (csv: string) => void }) {
  const { theme } = useTheme();
  const { query, setQuery, type, setType, status, setStatus, transactions } = useWalletHistory();
  return (
    <Card className="p-3.5">
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <AppText className="font-body-semibold text-base leading-[22px]">
            Transaction history
          </AppText>
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
          <View className="flex-1">
            <FilterDropdown
              accessibilityLabel="Transaction type"
              value={type}
              options={typeFilterOptions}
              onChange={setType}
            />
          </View>
          <View className="flex-1">
            <FilterDropdown
              accessibilityLabel="Transaction status"
              value={status}
              options={statusFilterOptions}
              onChange={setStatus}
            />
          </View>
        </View>
        {transactions.length ? (
          <View
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: theme.border }}
          >
            {transactions.map((item, index) => (
              <View key={item.id}>
                {index > 0 ? (
                  <View className="mx-3.5 h-px" style={{ backgroundColor: theme.borderSubtle }} />
                ) : null}
                <TransactionRow transaction={item} />
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

function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const { theme } = useTheme();
  const positive = transaction.amount >= 0;
  return (
    <View className="flex-row items-center gap-3 px-3.5 py-3">
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{
          backgroundColor: positive ? theme.feedback.success.background : theme.surfaceSecondary,
        }}
      >
        <Icon
          name={transactionIcons[transaction.type]}
          size={17}
          color={positive ? theme.feedback.success.icon : theme.textSecondary}
        />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <AppText numberOfLines={2} className="font-body-semibold text-xs leading-4">
          {transaction.title}
        </AppText>
        <AppText
          numberOfLines={1}
          className="text-[10px] leading-[14px]"
          style={{ color: theme.textPlaceholder }}
        >
          {transaction.date} · {transaction.reference}
        </AppText>
      </View>
      <View className="items-end gap-1">
        <AppText
          className="font-mono text-xs leading-4"
          style={{ color: positive ? theme.feedback.success.text : theme.error }}
        >
          {positive ? '+' : '−'}AED {Math.abs(transaction.amount).toFixed(2)}
        </AppText>
        <StatusPill label={transaction.status} tone={statusTone[transaction.status]} />
      </View>
    </View>
  );
}

export function PaymentMethods({ onAdd, onLink }: { onAdd: () => void; onLink: () => void }) {
  const { theme } = useTheme();
  const { tab, setTab, cards, removeCard } = usePaymentMethods();
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText className="font-body-semibold text-base leading-[22px]">Payment methods</AppText>
        <Pressable
          accessibilityRole="button"
          onPress={onAdd}
          className="h-9 flex-row items-center gap-1.5 rounded-xl px-3"
          style={{ backgroundColor: theme.accent }}
        >
          <Icon name="plus" size={16} color={theme.accentForeground} />
          <AppText className="font-body-semibold text-xs" style={{ color: theme.accentForeground }}>
            Add
          </AppText>
        </Pressable>
      </View>
      <SegmentedControl options={paymentMethodOptions} value={tab} onChange={setTab} size="sm" />
      {tab === 'cards' ? (
        <View className="gap-2.5">
          {cards.map((card) => (
            <PaymentMethodRow
              key={card.number}
              card={card}
              onRemove={() => removeCard(card.number)}
            />
          ))}
          {!cards.length ? (
            <AppText className="text-sm" style={{ color: theme.textTertiary }}>
              No saved cards.
            </AppText>
          ) : null}
        </View>
      ) : (
        <Card className="p-3.5">
          <View className="flex-row items-center gap-3">
            <View
              className="h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <Icon name="account-balance-wallet" size={20} color={theme.accent} />
            </View>
            <View className="flex-1 gap-0.5">
              <AppText className="font-body-semibold text-[13px] leading-[18px]">
                Add a bank account
              </AppText>
              <AppText
                className="text-[11px] leading-[15px]"
                style={{ color: theme.textPlaceholder }}
              >
                Needed to withdraw funds
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Link bank account"
              onPress={onLink}
            >
              <Chip label="Link" tone="neutral" />
            </Pressable>
          </View>
        </Card>
      )}
    </View>
  );
}

function PaymentMethodRow({ card, onRemove }: { card: PaymentCard; onRemove: () => void }) {
  const { theme } = useTheme();
  const brandName = card.brand === 'VISA' ? 'Visa' : 'Mastercard';
  return (
    <Card className="p-3.5">
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.surfaceSecondary }}
        >
          <AppText className="font-body-bold text-[11px] leading-[15px]">{card.brand}</AppText>
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <View className="flex-row flex-wrap items-center gap-2">
            <AppText className="font-body-semibold text-[13px] leading-[18px]">
              {brandName} •••• {card.number}
            </AppText>
            {card.isDefault ? <Chip label="Default" tone="success" /> : null}
          </View>
          <AppText className="text-[11px] leading-[15px]" style={{ color: theme.textPlaceholder }}>
            Expires {card.expiry} · Deposit only
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${brandName} ending in ${card.number}`}
          onPress={onRemove}
          hitSlop={8}
        >
          <Icon name="close" size={18} color={theme.textTertiary} />
        </Pressable>
      </View>
    </Card>
  );
}
