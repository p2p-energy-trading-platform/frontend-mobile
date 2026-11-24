import { useState } from 'react';
import { Modal, Pressable, ScrollView, Share, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { walletHeader, walletViewOptions } from './constants';
import { useWalletView } from './hooks';
import { transactionsToCsv } from './utils';
import { BalanceCard, PaymentMethods, TransactionHistory } from './components/WalletSections';

function ActionButton({
  title,
  icon,
  onPress,
  primary = false,
}: {
  title: string;
  icon: 'south-west' | 'north-east';
  onPress: () => void;
  primary?: boolean;
}) {
  const { theme } = useTheme();
  const color = primary ? theme.accentForeground : theme.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border"
      style={{
        backgroundColor: primary ? theme.accent : theme.surface,
        borderColor: primary ? theme.accent : theme.border,
      }}
    >
      <Icon name={icon} size={17} color={color} />
      <AppText className="font-body-semibold text-sm" style={{ color }}>
        {title}
      </AppText>
    </Pressable>
  );
}

function NoticeSheet({ action, onClose }: { action: string; onClose: () => void }) {
  const { theme } = useTheme();
  return (
    <Modal transparent animationType="slide" visible onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close notice"
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
            <AppText className="font-body-semibold text-lg leading-6">{action} coming soon</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose}>
              <Icon name="close" size={20} color={theme.textTertiary} />
            </Pressable>
          </View>
          <AppText className="text-sm leading-5" style={{ color: theme.textSecondary }}>
            {action} is not available yet. We’ll let you know when it’s ready.
          </AppText>
          <Button title="Got it" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function WalletScreen() {
  const { theme } = useTheme();
  const { view, setView } = useWalletView();
  const [notice, setNotice] = useState('');
  const openNotice = (action: string) => setNotice(action);
  const exportCsv = async (csv: string) => {
    try {
      await Share.share({ title: 'Wallet transactions CSV', message: csv });
    } catch {
      openNotice('CSV sharing');
    }
  };

  return (
    <AppShell unreadCount={walletHeader.unreadCount} initials={walletHeader.initials}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-3 px-6 pb-6 pt-3"
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Wallet" subtitle={walletHeader.subtitle} />
        <BalanceCard />
        <View className="flex-row gap-3">
          <ActionButton
            title="Deposit"
            icon="south-west"
            primary
            onPress={() => openNotice('Deposit')}
          />
          <ActionButton title="Withdraw" icon="north-east" onPress={() => openNotice('Withdraw')} />
        </View>
        <SegmentedControl options={walletViewOptions} value={view} onChange={setView} size="md" />
        {view === 'payments' ? (
          <PaymentMethods
            onAdd={() => openNotice('Add payment method')}
            onLink={() => openNotice('Bank account linking')}
          />
        ) : (
          <TransactionHistory onExport={(csv) => void exportCsv(csv)} />
        )}
      </ScrollView>
      {notice ? <NoticeSheet action={notice} onClose={() => setNotice('')} /> : null}
    </AppShell>
  );
}
