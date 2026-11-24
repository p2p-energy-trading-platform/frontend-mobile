import { useState } from 'react';
import { ScrollView, Share, View } from 'react-native';

import { PageHeader } from '@/shared/components/ui/PageHeader';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { AppShell } from '@/shared/components/ui/layout/AppShell';

import { BalanceCard } from './components/BalanceCard';
import { ComingSoonSheet } from './components/ComingSoonSheet';
import { PaymentMethods } from './components/PaymentMethods';
import { TransactionHistory } from './components/TransactionHistory';
import { WalletActionButton } from './components/WalletActionButton';
import { walletHeader, walletViewOptions } from './constants';
import { useWalletView } from './hooks';

export default function WalletScreen() {
  const { view, setView } = useWalletView();
  const [notice, setNotice] = useState<string | null>(null);

  const exportCsv = async (csv: string) => {
    try {
      await Share.share({ title: 'Wallet transactions CSV', message: csv });
    } catch {
      setNotice('CSV sharing');
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
          <WalletActionButton
            title="Deposit"
            icon="south-west"
            primary
            onPress={() => setNotice('Deposit')}
          />
          <WalletActionButton
            title="Withdraw"
            icon="north-east"
            onPress={() => setNotice('Withdraw')}
          />
        </View>

        <SegmentedControl options={walletViewOptions} value={view} onChange={setView} size="md" />

        {view === 'payments' ? (
          <PaymentMethods
            onAdd={() => setNotice('Add payment method')}
            onLink={() => setNotice('Bank account linking')}
          />
        ) : (
          <TransactionHistory onExport={(csv) => void exportCsv(csv)} />
        )}
      </ScrollView>

      {notice ? <ComingSoonSheet action={notice} onClose={() => setNotice(null)} /> : null}
    </AppShell>
  );
}
