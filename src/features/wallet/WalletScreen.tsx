import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { StatusPill } from '@/shared/components/ui/StatusPill';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import {
  paymentMethodOptions,
  transactionStatusOptions,
  transactionTypeOptions,
  transactions,
  walletHeader,
} from './constants';
import type { PaymentMethodTab, Transaction, TransactionStatus, TransactionType } from './types';
import { filterTransactions } from './utils';

const statTiles = [
  { label: 'Pending', detail: 'Settling', value: 'AED 32.80' },
  { label: 'Reserved', detail: 'Open orders', value: 'AED 48.50' },
  { label: 'Lifetime in', detail: 'All deposits', value: 'AED 1,240.00' },
] as const;

function statusTone(status: Transaction['status']) {
  if (status === 'settled') return 'success' as const;
  if (status === 'pending') return 'warning' as const;
  return 'error' as const;
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const { theme } = useTheme();
  const amountColor =
    transaction.direction === 'positive' ? theme.feedback.success.text : theme.feedback.error.text;

  return (
    <View
      className="flex-row items-center gap-3 border-b py-3.5"
      style={{ borderColor: theme.borderSubtle }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: theme.surfaceSecondary }}
      >
        <Icon name={transaction.icon} size={18} color={theme.textSecondary} />
      </View>

      <View className="flex-1 gap-1">
        <AppText
          numberOfLines={1}
          style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.bodySemibold }}
        >
          {transaction.title}
        </AppText>
        <AppText
          numberOfLines={1}
          style={{
            color: theme.textTertiary,
            fontSize: 11,
            lineHeight: 16,
            fontFamily: FontFamily.body,
          }}
        >
          {transaction.date} · {transaction.reference}
        </AppText>
      </View>

      <View className="items-end gap-1">
        <AppText
          style={{ color: amountColor, fontSize: 13, lineHeight: 18, fontFamily: FontFamily.mono }}
        >
          {transaction.amount}
        </AppText>
        <StatusPill
          label={
            transaction.status === 'settled'
              ? 'Settled'
              : transaction.status === 'pending'
                ? 'Pending'
                : 'Failed'
          }
          tone={statusTone(transaction.status)}
        />
      </View>
    </View>
  );
}

export function WalletScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'all'>('all');
  const [paymentTab, setPaymentTab] = useState<PaymentMethodTab>('cards');
  const [comingSoon, setComingSoon] = useState<string | null>(null);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, search, typeFilter, statusFilter),
    [search, typeFilter, statusFilter],
  );

  return (
    <AppShell unreadCount={3} initials="SA">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-5 py-4"
        showsVerticalScrollIndicator={false}
      >
        <PageHeader
          title={walletHeader.title}
          subtitle={`AED balance · ${walletHeader.property}`}
        />

        <View
          className="gap-5 rounded-2xl p-5"
          style={{ backgroundColor: theme.walletHeroBackground }}
        >
          <View className="gap-1">
            <AppText
              style={{
                color: theme.textInverse,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: FontFamily.bodyMedium,
              }}
            >
              Available balance
            </AppText>
            <AppText
              style={{
                color: theme.textInverse,
                fontSize: 32,
                lineHeight: 40,
                fontFamily: FontFamily.mono,
              }}
            >
              AED 284.50
            </AppText>
            <AppText
              style={{
                color: theme.textInverse,
                opacity: 0.72,
                fontSize: 12,
                lineHeight: 17,
                fontFamily: FontFamily.body,
              }}
            >
              1 GridX credit = AED 1.00
            </AppText>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button title="Deposit" onPress={() => setComingSoon('Deposit')} />
            </View>
            <Pressable
              accessibilityRole="button"
              className="h-12 flex-1 items-center justify-center rounded-xl border px-5"
              style={{ borderColor: theme.textInverse, backgroundColor: 'transparent' }}
              onPress={() => setComingSoon('Withdraw')}
            >
              <AppText
                style={{
                  color: theme.textInverse,
                  fontFamily: FontFamily.bodySemibold,
                }}
              >
                Withdraw
              </AppText>
            </Pressable>
          </View>
        </View>

        <View className="flex-row gap-2.5">
          {statTiles.map((tile) => (
            <Card key={tile.label} style={{ flex: 1, padding: 12 }}>
              <View className="gap-1">
                <AppText
                  numberOfLines={1}
                  style={{ color: theme.textSecondary, fontSize: 11, lineHeight: 16 }}
                >
                  {tile.label}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.mono }}
                >
                  {tile.value}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={{
                    color: theme.textTertiary,
                    fontSize: 9,
                    lineHeight: 13,
                    fontFamily: FontFamily.body,
                  }}
                >
                  {tile.detail}
                </AppText>
              </View>
            </Card>
          ))}
        </View>

        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <View
            className="flex-row items-center justify-between border-b px-4 py-3.5"
            style={{ borderColor: theme.borderSubtle }}
          >
            <AppText style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
              Transaction history
            </AppText>
            <Pressable
              accessibilityRole="button"
              className="h-9 flex-row items-center gap-1.5 rounded-xl border px-3"
              style={{ borderColor: theme.border }}
              onPress={() => setComingSoon('CSV export')}
            >
              <Icon name="download" size={15} color={theme.text} />
              <AppText style={{ fontSize: 12, lineHeight: 16, fontFamily: FontFamily.bodyMedium }}>
                Export CSV
              </AppText>
            </Pressable>
          </View>

          <View className="gap-3 px-4 pt-3">
            <Input
              value={search}
              onChangeText={setSearch}
              placeholder="Search transactions"
              accessibilityLabel="Search transactions"
              className="h-11"
            />

            <View className="flex-row gap-2">
              <FilterDropdown
                options={transactionTypeOptions}
                value={typeFilter}
                onChange={setTypeFilter}
                accessibilityLabel="Transaction type"
                label="Type"
              />
              <FilterDropdown
                options={transactionStatusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                accessibilityLabel="Transaction status"
                label="Status"
              />
            </View>
          </View>

          <View className="px-4 pb-1">
            {filteredTransactions.length ? (
              filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <View className="items-center py-10">
                <View
                  className="mb-3 h-11 w-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: theme.surfaceSecondary }}
                >
                  <Icon name="folder-open" size={20} color={theme.textTertiary} />
                </View>
                <AppText
                  style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}
                >
                  No transactions found
                </AppText>
                <AppText
                  style={{
                    color: theme.textTertiary,
                    marginTop: 4,
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  Try changing your search or filters.
                </AppText>
              </View>
            )}
          </View>
        </Card>

        <Card>
          <View className="gap-4">
            <View className="flex-row items-center justify-between">
              <AppText
                style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}
              >
                Payment methods
              </AppText>
              <Pressable
                accessibilityRole="button"
                className="h-9 flex-row items-center gap-1 rounded-xl border px-3"
                style={{ borderColor: theme.border }}
                onPress={() => setComingSoon('Add payment method')}
              >
                <Icon name="plus" size={15} color={theme.text} />
                <AppText
                  style={{ fontSize: 12, lineHeight: 16, fontFamily: FontFamily.bodyMedium }}
                >
                  Add
                </AppText>
              </Pressable>
            </View>

            <SegmentedControl
              options={paymentMethodOptions}
              value={paymentTab}
              onChange={setPaymentTab}
            />

            {paymentTab === 'cards' ? (
              <View className="gap-3">
                <View
                  className="flex-row items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: theme.borderSubtle, backgroundColor: theme.surfaceAlt }}
                >
                  <View
                    className="h-10 w-14 items-center justify-center rounded-lg"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <Text className="font-heading text-xs" style={{ color: theme.text }}>
                      VISA
                    </Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                      <AppText
                        style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.mono }}
                      >
                        •••• 4242
                      </AppText>
                      <Chip label="Default" tone="success" dot />
                    </View>
                    <AppText style={{ color: theme.textTertiary, fontSize: 11, lineHeight: 16 }}>
                      Expires 09/29 · Deposit only
                    </AppText>
                  </View>
                </View>

                <View
                  className="flex-row items-center gap-3 rounded-xl border p-3"
                  style={{ borderColor: theme.borderSubtle, backgroundColor: theme.surfaceAlt }}
                >
                  <View
                    className="h-10 w-14 items-center justify-center rounded-lg"
                    style={{ backgroundColor: theme.surface }}
                  >
                    <Text className="font-heading text-xs" style={{ color: theme.text }}>
                      MC
                    </Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <AppText style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.mono }}>
                      •••• 8821
                    </AppText>
                    <AppText style={{ color: theme.textTertiary, fontSize: 11, lineHeight: 16 }}>
                      Expires 04/28 · Deposit only
                    </AppText>
                  </View>
                </View>
              </View>
            ) : (
              <View
                className="items-center justify-center rounded-xl border py-8"
                style={{ borderColor: theme.borderSubtle, backgroundColor: theme.surfaceAlt }}
              >
                <Icon name="account-balance-wallet" size={24} color={theme.textTertiary} />
                <AppText
                  style={{
                    marginTop: 8,
                    color: theme.textSecondary,
                    fontSize: 13,
                    lineHeight: 18,
                  }}
                >
                  No bank accounts added
                </AppText>
              </View>
            )}
          </View>
        </Card>
      </ScrollView>

      <Modal
        transparent
        statusBarTranslucent
        animationType="slide"
        visible={comingSoon !== null}
        onRequestClose={() => setComingSoon(null)}
      >
        <View className="flex-1" style={{ backgroundColor: theme.overlay }}>
          <Pressable
            className="flex-1"
            accessibilityLabel="Close coming soon sheet"
            onPress={() => setComingSoon(null)}
          />
          <View
            className="items-center rounded-t-3xl border-t px-5 pt-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              paddingBottom: insets.bottom + 16,
            }}
          >
            <View
              className="mb-4 h-1 w-10 rounded-full"
              style={{ backgroundColor: theme.borderStrong }}
            />
            <View
              className="mb-3 h-12 w-12 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <Icon name="clock-3" size={22} color={theme.textSecondary} />
            </View>
            <AppText style={{ fontSize: 18, lineHeight: 24, fontFamily: FontFamily.heading }}>
              Coming soon
            </AppText>
            <AppText
              style={{
                marginTop: 6,
                color: theme.textSecondary,
                textAlign: 'center',
                fontSize: 13,
                lineHeight: 20,
              }}
            >
              {comingSoon} is not available yet.
            </AppText>
            <Pressable
              accessibilityRole="button"
              className="mt-5 h-12 w-full items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.primary }}
              onPress={() => setComingSoon(null)}
            >
              <AppText
                style={{ color: theme.primaryForeground, fontFamily: FontFamily.bodySemibold }}
              >
                Got it
              </AppText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}
