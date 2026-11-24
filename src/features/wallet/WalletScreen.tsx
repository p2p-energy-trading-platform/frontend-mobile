import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';

import { StatusPill } from '@/features/history/components/StatusPill';
import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import {
  paymentMethodOptions,
  statusFilterOptions,
  transactionIcons,
  transactionTypeLabels,
  typeFilterOptions,
  walletHeader,
  walletStats,
  walletTransactions,
  walletViewOptions,
  type TransactionStatus,
  type TransactionType,
} from './constants';

type WalletView = 'payments' | 'history';
type PaymentMethodTab = 'cards' | 'banks';

const statusTone: Record<TransactionStatus, 'success' | 'warning' | 'error'> = {
  Settled: 'success',
  Pending: 'warning',
  Failed: 'error',
};

function BalanceCard() {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="gap-4">
        <AppText style={{ color: theme.textSecondary, fontSize: 13, lineHeight: 18 }}>
          Available balance
        </AppText>

        <View className="flex-row items-baseline gap-2">
          <AppText
            style={{
              color: theme.accent,
              fontSize: 38,
              lineHeight: 44,
              fontFamily: FontFamily.mono,
            }}
          >
            284.50
          </AppText>
          <AppText style={{ color: theme.textPlaceholder, fontSize: 16, lineHeight: 22 }}>
            AED
          </AppText>
        </View>

        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />

        <View className="flex-row justify-between">
          {walletStats.map((stat, index) => (
            <View key={stat.label} className="gap-0.5" style={{ flex: 1 }}>
              <AppText
                style={{
                  color: theme.textTertiary,
                  fontSize: 11,
                  lineHeight: 15,
                }}
              >
                {stat.label}
              </AppText>
              <AppText
                style={{
                  color: index === 0 ? theme.warning : theme.text,
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: FontFamily.mono,
                }}
              >
                {stat.value}
              </AppText>
              <AppText style={{ color: theme.textPlaceholder, fontSize: 10, lineHeight: 14 }}>
                {stat.caption}
              </AppText>
            </View>
          ))}
        </View>

        <AppText style={{ color: theme.textTertiary, fontSize: 11, lineHeight: 15 }}>
          1 GridX credit = AED 1.00
        </AppText>
      </View>
    </Card>
  );
}

function WalletActionButton({
  title,
  icon,
  variant,
  onPress,
}: {
  title: string;
  icon: 'south-west' | 'north-east';
  variant: 'primary' | 'outline';
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const isPrimary = variant === 'primary';
  const foreground = isPrimary ? theme.accentForeground : theme.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border"
      style={{
        backgroundColor: isPrimary ? theme.accent : theme.surface,
        borderColor: isPrimary ? theme.accent : theme.border,
      }}
    >
      <Icon name={icon} size={17} color={foreground} />
      <AppText style={{ color: foreground, fontSize: 14, fontFamily: FontFamily.bodySemibold }}>
        {title}
      </AppText>
    </Pressable>
  );
}

function TransactionRow({ transaction }: { transaction: (typeof walletTransactions)[number] }) {
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
        <AppText
          numberOfLines={2}
          style={{ fontSize: 12, lineHeight: 16, fontFamily: FontFamily.bodySemibold }}
        >
          {transaction.title}
        </AppText>
        <AppText
          numberOfLines={1}
          style={{ color: theme.textPlaceholder, fontSize: 10, lineHeight: 14 }}
        >
          {transaction.date} · {transaction.reference}
        </AppText>
      </View>

      <View className="items-end gap-1">
        <AppText
          style={{
            color: positive ? theme.feedback.success.text : theme.error,
            fontSize: 12,
            lineHeight: 16,
            fontFamily: FontFamily.mono,
          }}
        >
          {positive ? '+' : '−'}AED {Math.abs(transaction.amount).toFixed(2)}
        </AppText>
        <StatusPill label={transaction.status} tone={statusTone[transaction.status]} />
      </View>
    </View>
  );
}

function TransactionHistory() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | TransactionType>('all');
  const [status, setStatus] = useState<'all' | TransactionStatus>('all');

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return walletTransactions.filter((transaction) => {
      const matchesType = type === 'all' || transaction.type === type;
      const matchesStatus = status === 'all' || transaction.status === status;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          transaction.title,
          transaction.date,
          transaction.reference,
          transaction.status,
          transactionTypeLabels[transaction.type],
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [query, status, type]);

  return (
    <Card style={{ padding: 14 }}>
      <View className="mb-3 flex-row items-center justify-between">
        <AppText style={{ fontSize: 16, lineHeight: 22, fontFamily: FontFamily.bodySemibold }}>
          Transaction history
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Export CSV"
          className="h-9 w-9 items-center justify-center rounded-xl border"
          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
        >
          <Icon name="download" size={17} color={theme.textSecondary} />
        </Pressable>
      </View>

      <View className="mb-2">
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
      </View>

      <View className="mb-2 flex-row gap-2">
        <View className="flex-1">
          <FilterDropdown
            accessibilityLabel="Transaction type"
            label="Type"
            value={type}
            options={typeFilterOptions}
            onChange={setType}
          />
        </View>
        <View className="flex-1">
          <FilterDropdown
            accessibilityLabel="Transaction status"
            label="Status"
            value={status}
            options={statusFilterOptions}
            onChange={setStatus}
          />
        </View>
      </View>

      {filteredTransactions.length > 0 ? (
        <View className="overflow-hidden rounded-2xl border" style={{ borderColor: theme.border }}>
          {filteredTransactions.map((transaction, index) => (
            <View key={transaction.id}>
              {index > 0 ? (
                <View className="mx-3.5 h-px" style={{ backgroundColor: theme.borderSubtle }} />
              ) : null}
              <TransactionRow transaction={transaction} />
            </View>
          ))}
        </View>
      ) : (
        <View
          className="items-center gap-2 rounded-2xl border border-dashed px-5 py-8"
          style={{ borderColor: theme.border }}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: theme.surfaceSecondary }}
          >
            <Icon name="search" size={18} color={theme.textTertiary} />
          </View>
          <AppText style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}>
            No transactions found
          </AppText>
          <AppText style={{ color: theme.textTertiary, fontSize: 12, lineHeight: 17 }}>
            Try a different search or filter.
          </AppText>
        </View>
      )}
    </Card>
  );
}

function PaymentMethodRow({
  brand,
  number,
  expiry,
  isDefault = false,
}: {
  brand: 'VISA' | 'MC';
  number: string;
  expiry: string;
  isDefault?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <Card style={{ padding: 14 }}>
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.surfaceSecondary }}
        >
          {brand === 'VISA' ? (
            <AppText style={{ fontSize: 11, lineHeight: 15, fontFamily: FontFamily.bodyBold }}>
              VISA
            </AppText>
          ) : (
            <View className="flex-row">
              <View
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: theme.error, marginRight: -5 }}
              />
              <View className="h-4 w-4 rounded-full" style={{ backgroundColor: theme.warning }} />
            </View>
          )}
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <View className="flex-row flex-wrap items-center gap-2">
            <AppText style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.bodySemibold }}>
              {brand === 'VISA' ? 'Visa' : 'Mastercard'} •••• {number}
            </AppText>
            {isDefault ? <Chip label="Default" tone="success" /> : null}
          </View>
          <AppText style={{ color: theme.textPlaceholder, fontSize: 11, lineHeight: 15 }}>
            Expires {expiry} · Deposit only
          </AppText>
        </View>

        <Icon name="close" size={18} color={theme.textTertiary} />
      </View>
    </Card>
  );
}

function PaymentMethods() {
  const { theme } = useTheme();
  const [tab, setTab] = useState<PaymentMethodTab>('cards');

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText style={{ fontSize: 16, lineHeight: 22, fontFamily: FontFamily.bodySemibold }}>
          Payment methods
        </AppText>
        <Pressable
          accessibilityRole="button"
          className="h-9 flex-row items-center gap-1.5 rounded-xl px-3"
          style={{ backgroundColor: theme.accent }}
        >
          <Icon name="plus" size={16} color={theme.accentForeground} />
          <AppText
            style={{
              color: theme.accentForeground,
              fontSize: 12,
              fontFamily: FontFamily.bodySemibold,
            }}
          >
            Add
          </AppText>
        </Pressable>
      </View>

      <SegmentedControl options={paymentMethodOptions} value={tab} onChange={setTab} size="sm" />

      {tab === 'cards' ? (
        <View className="gap-2.5">
          <PaymentMethodRow brand="VISA" number="4821" expiry="09/27" isDefault />
          <PaymentMethodRow brand="MC" number="3802" expiry="04/26" />
        </View>
      ) : (
        <Card style={{ padding: 14 }}>
          <View className="flex-row items-center gap-3">
            <View
              className="h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <Icon name="account-balance-wallet" size={20} color={theme.accent} />
            </View>
            <View className="flex-1 gap-0.5">
              <AppText
                style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.bodySemibold }}
              >
                Add a bank account
              </AppText>
              <AppText style={{ color: theme.textPlaceholder, fontSize: 11, lineHeight: 15 }}>
                Needed to withdraw funds
              </AppText>
            </View>
            <Chip label="Link" tone="neutral" />
          </View>
        </Card>
      )}
    </View>
  );
}

function ComingSoonSheet({
  visible,
  onClose,
  action,
}: {
  visible: boolean;
  onClose: () => void;
  action: string;
}) {
  const { theme } = useTheme();

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close coming soon sheet"
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: theme.overlay }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="gap-4 rounded-t-3xl px-6 pb-8 pt-5"
          style={{ backgroundColor: theme.surface }}
        >
          <View
            className="h-1 w-10 self-center rounded-full"
            style={{ backgroundColor: theme.borderStrong }}
          />
          <View className="flex-row items-center justify-between">
            <AppText style={{ fontSize: 18, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
              {action} coming soon
            </AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose}>
              <Icon name="close" size={20} color={theme.textTertiary} />
            </Pressable>
          </View>
          <AppText style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
            {action} is not available yet. We’ll let you know when it’s ready.
          </AppText>
          <Button title="Got it" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function WalletScreen() {
  const [view, setView] = useState<WalletView>('payments');
  const [sheetAction, setSheetAction] = useState('Deposit');
  const [sheetVisible, setSheetVisible] = useState(false);

  const openComingSoon = (action: string) => {
    setSheetAction(action);
    setSheetVisible(true);
  };

  return (
    <AppShell unreadCount={walletHeader.unreadCount} initials={walletHeader.initials}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 12, paddingTop: 12, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-6">
          <PageHeader title="Wallet" subtitle={walletHeader.subtitle} />
        </View>

        <View className="gap-3 px-6">
          <BalanceCard />
          <View className="flex-row gap-3">
            <WalletActionButton
              title="Deposit"
              icon="south-west"
              variant="primary"
              onPress={() => openComingSoon('Deposit')}
            />
            <WalletActionButton
              title="Withdraw"
              icon="north-east"
              variant="outline"
              onPress={() => openComingSoon('Withdraw')}
            />
          </View>
        </View>

        <View className="px-6">
          <SegmentedControl options={walletViewOptions} value={view} onChange={setView} size="md" />
        </View>

        <View className="px-6">
          {view === 'payments' ? <PaymentMethods /> : <TransactionHistory />}
        </View>
      </ScrollView>
      <ComingSoonSheet
        visible={sheetVisible}
        action={sheetAction}
        onClose={() => setSheetVisible(false)}
      />
    </AppShell>
  );
}
