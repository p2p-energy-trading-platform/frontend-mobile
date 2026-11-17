import { useState } from 'react';
import { View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/AppShell';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { HistoryHeader } from './components/HistoryHeader';
import { HistoryPlaceholder } from './components/HistoryPlaceholder';
import { HistoryTabs } from './components/HistoryTabs';
import { OrdersTab } from './components/OrderTab';
import { TradesTab } from './components/TradesTab';
import { historyHeader, historyTabs } from './constants';
import type { HistoryTab } from './types';

export default function HistoryScreen() {
  const goBack = useGoBack();

  const [tab, setTab] = useState<HistoryTab>('trades');

  return (
    <AppShell unreadCount={historyHeader.unreadCount} initials={historyHeader.initials}>
      <View className="flex-1 px-4 pt-5">
        <HistoryHeader
          title={historyHeader.title}
          subtitle={historyHeader.subtitle}
          onBack={goBack}
        />

        <View className="pt-5">
          <HistoryTabs options={historyTabs} value={tab} onChange={setTab} />
        </View>

        {tab === 'trades' ? <TradesTab /> : null}
        {tab === 'orders' ? <OrdersTab /> : null}
        {tab === 'statements' ? <HistoryPlaceholder title="Statements" /> : null}
      </View>
    </AppShell>
  );
}
