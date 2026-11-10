import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, View } from 'react-native';
import { Download, Search, X } from 'lucide-react-native';

import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { StatusPill } from '@/shared/components/ui/StatusPill';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import {
  transactionStatuses,
  transactionTypes,
  walletHeader,
  walletTransactions,
  type WalletTransaction,
} from './constants';

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1">
      <Pressable
        className="rounded-xl border px-3 py-2.5"
        onPress={() => setOpen((current) => !current)}
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <AppText style={{ color: theme.textSecondary, fontSize: 11 }}>{label}</AppText>
        <AppText
          numberOfLines={1}
          style={{ fontFamily: FontFamily.bodySemibold, fontSize: 12, marginTop: 2 }}
        >
          {value}
        </AppText>
      </Pressable>
      {open ? (
        <Card
          style={{
            marginTop: 4,
            padding: 6,
            position: 'absolute',
            top: 57,
            width: '100%',
            zIndex: 2,
          }}
        >
          {options.map((option) => (
            <Pressable
              key={option}
              className="rounded-lg px-2 py-2"
              onPress={() => {
                onChange(option);
                setOpen(false);
              }}
              style={option === value ? { backgroundColor: theme.surfaceSecondary } : undefined}
            >
              <AppText style={{ fontSize: 12 }}>{option}</AppText>
            </Pressable>
          ))}
        </Card>
      ) : null}
    </View>
  );
}

function TransactionRow({ transaction }: { transaction: WalletTransaction }) {
  const { theme } = useTheme();
  const positive = transaction.amount >= 0;
  return (
    <View
      className="flex-row items-center gap-3 border-b py-3"
      style={{ borderColor: theme.divider }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{
          backgroundColor: positive ? theme.feedback.success.background : theme.surfaceSecondary,
        }}
      >
        <Icon
          name={transaction.icon}
          color={positive ? theme.success : theme.textSecondary}
          size={17}
        />
      </View>
      <View className="min-w-0 flex-1">
        <AppText numberOfLines={1} style={{ fontFamily: FontFamily.bodySemibold, fontSize: 12 }}>
          {transaction.title}
        </AppText>
        <AppText style={{ color: theme.textTertiary, fontSize: 10, marginTop: 3 }}>
          {transaction.date} · {transaction.reference}
        </AppText>
      </View>
      <View className="items-end gap-1">
        <AppText
          style={{
            color: positive ? theme.success : theme.error,
            fontFamily: FontFamily.mono,
            fontSize: 12,
          }}
        >
          {positive ? '+' : '−'}AED {Math.abs(transaction.amount).toFixed(2)}
        </AppText>
        <StatusPill status={transaction.status} />
      </View>
    </View>
  );
}

export default function WalletScreen() {
  const { theme } = useTheme();
  const [sheet, setSheet] = useState<'deposit' | 'withdraw' | null>(null);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('All types');
  const [status, setStatus] = useState<string>('All statuses');
  const [paymentTab, setPaymentTab] = useState<'cards' | 'banks'>('cards');

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return walletTransactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        `${transaction.title} ${transaction.reference} ${transaction.date}`
          .toLowerCase()
          .includes(query);
      const matchesType = type === 'All types' || transaction.type === type;
      const matchesStatus = status === 'All statuses' || transaction.status === status;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [search, status, type]);

  return (
    <AppShell unreadCount={walletHeader.unreadCount} initials={walletHeader.initials}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 14,
          paddingBottom: 24,
          paddingHorizontal: 24,
          paddingTop: 14,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Wallet" subtitle={`AED balance · ${walletHeader.property}`} />
        <Card
          style={{
            backgroundColor: theme.walletHeroBackground,
            borderColor: theme.walletHeroBackground,
          }}
        >
          <AppText style={{ color: '#A8BDD4', fontSize: 12 }}>Available balance</AppText>
          <AppText
            style={{
              color: theme.textInverse,
              fontFamily: FontFamily.mono,
              fontSize: 32,
              marginTop: 5,
            }}
          >
            AED 284.50
          </AppText>
          <AppText style={{ color: '#A8BDD4', fontSize: 11, marginTop: 5 }}>
            1 GridX credit = AED 1.00
          </AppText>
          <View className="mt-4 flex-row gap-2">
            <Button
              title="Deposit"
              variant="accent"
              onPress={() => setSheet('deposit')}
              containerStyle={{ flex: 1 }}
            />
            <Button
              title="Withdraw"
              onPress={() => setSheet('withdraw')}
              containerStyle={{
                backgroundColor: 'transparent',
                borderColor: '#94B4DC55',
                borderWidth: 1,
                flex: 1,
              }}
              textStyle={{ color: theme.textInverse }}
            />
          </View>
        </Card>
        <View className="flex-row gap-2">
          {[
            ['Pending', 'AED 12.40', 'Settling'],
            ['Reserved', 'AED 38.20', 'Open orders'],
            ['Lifetime in', 'AED 1,284.50', 'All deposits'],
          ].map(([label, amount, note]) => (
            <Card key={label} style={{ flex: 1, padding: 11 }}>
              <AppText style={{ color: theme.textSecondary, fontSize: 10 }}>{label}</AppText>
              <AppText style={{ fontFamily: FontFamily.mono, fontSize: 13, marginTop: 7 }}>
                {amount}
              </AppText>
              <AppText style={{ color: theme.textTertiary, fontSize: 9, marginTop: 4 }}>
                {note}
              </AppText>
            </Card>
          ))}
        </View>
        <Card>
          <View className="flex-row items-center justify-between">
            <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>
              Transaction history
            </AppText>
            <Pressable
              className="flex-row items-center gap-1"
              onPress={() => Alert.alert('Export CSV', 'CSV export will be available soon.')}
            >
              <Download color={theme.accent} size={14} />
              <AppText style={{ color: theme.accent, fontSize: 11 }}>Export CSV</AppText>
            </Pressable>
          </View>
          <View className="relative mt-3">
            <Input
              onChangeText={setSearch}
              placeholder="Search transactions"
              value={search}
              style={{ paddingLeft: 38 }}
            />
            <Search
              color={theme.textTertiary}
              size={17}
              style={{ left: 13, position: 'absolute', top: 13 }}
            />
          </View>
          <View className="mt-2 flex-row gap-2">
            <FilterDropdown
              label="Type"
              options={transactionTypes}
              value={type}
              onChange={setType}
            />
            <FilterDropdown
              label="Status"
              options={transactionStatuses}
              value={status}
              onChange={setStatus}
            />
          </View>
          <View className="mt-2">
            {filteredTransactions.length ? (
              filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <View className="items-center py-8">
                <AppText style={{ fontFamily: FontFamily.bodySemibold }}>
                  No transactions found
                </AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 12, marginTop: 4 }}>
                  Try changing your search or filters.
                </AppText>
              </View>
            )}
          </View>
        </Card>
        <Card>
          <View className="flex-row items-center justify-between">
            <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 16 }}>
              Payment methods
            </AppText>
            <Pressable
              onPress={() =>
                Alert.alert('Add payment method', 'Adding payment methods will be available soon.')
              }
            >
              <AppText
                style={{ color: theme.accent, fontFamily: FontFamily.bodySemibold, fontSize: 12 }}
              >
                Add
              </AppText>
            </Pressable>
          </View>
          <View className="mt-3">
            <SegmentedControl
              options={[
                { label: 'Debit/Credit', value: 'cards' },
                { label: 'Bank accounts', value: 'banks' },
              ]}
              size="sm"
              value={paymentTab}
              onChange={setPaymentTab}
            />
          </View>
          {paymentTab === 'cards' ? (
            <View className="mt-3 flex-row items-center gap-3">
              <View
                className="h-10 w-14 items-center justify-center rounded-lg border"
                style={{ borderColor: theme.border }}
              >
                <AppText style={{ fontFamily: FontFamily.bodyBold, fontSize: 11 }}>VISA</AppText>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 13 }}>
                    •••• 4242
                  </AppText>
                  <Chip label="Default" tone="success" />
                </View>
                <AppText style={{ color: theme.textSecondary, fontSize: 11, marginTop: 4 }}>
                  Expires 08/27 · Deposit only
                </AppText>
              </View>
            </View>
          ) : (
            <View className="mt-3 flex-row items-center gap-3">
              <View
                className="h-10 w-14 items-center justify-center rounded-lg border"
                style={{ borderColor: theme.border }}
              >
                <AppText style={{ fontFamily: FontFamily.bodyBold, fontSize: 11 }}>MC</AppText>
              </View>
              <View>
                <AppText style={{ fontFamily: FontFamily.bodySemibold, fontSize: 13 }}>
                  Emirates NBD · •••• 1098
                </AppText>
                <AppText style={{ color: theme.textSecondary, fontSize: 11, marginTop: 4 }}>
                  Default · Withdrawal enabled
                </AppText>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent
        visible={sheet !== null}
        onRequestClose={() => setSheet(null)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: theme.overlay }}>
          <View className="rounded-t-3xl p-6" style={{ backgroundColor: theme.surface }}>
            <View className="flex-row items-center justify-between">
              <AppText style={{ fontFamily: FontFamily.heading, fontSize: 20 }}>
                {sheet === 'deposit' ? 'Deposit funds' : 'Withdraw funds'}
              </AppText>
              <Pressable onPress={() => setSheet(null)}>
                <X color={theme.textSecondary} size={20} />
              </Pressable>
            </View>
            <AppText style={{ color: theme.textSecondary, lineHeight: 21, marginTop: 12 }}>
              This {sheet} flow is coming soon. Your balance and payment methods are safe and
              unchanged.
            </AppText>
            <Button
              title="Got it"
              variant="accent"
              onPress={() => setSheet(null)}
              containerStyle={{ marginTop: 20 }}
            />
          </View>
        </View>
      </Modal>
    </AppShell>
  );
}
