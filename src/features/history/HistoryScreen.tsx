import { useState } from 'react';
import { View } from 'react-native';

import { Screen } from '@/shared/components/ui/Screen';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { HistoryHeader } from './components/HistoryHeader';

import { HistoryTabs } from './components/HistoryTabs';
import { OrdersTab } from './components/OrderTab';
import { StatementsTab } from './components/StatementsTab';
import { TradesTab } from './components/TradesTab';
import { historyHeader, historyTabs } from './constants';
import type { HistoryTab } from './types';

const VISIBLE = { flex: 1 } as const;
const HIDDEN = { display: 'none' } as const;

export default function HistoryScreen() {
  const goBack = useGoBack();

  const [tab, setTab] = useState<HistoryTab>('trades');

  return (
    <Screen>
      <View className="flex-1 px-4 pt-5">
        <HistoryHeader
          title={historyHeader.title}
          subtitle={historyHeader.subtitle}
          onBack={goBack}
        />

        <View className="pt-5">
          <HistoryTabs options={historyTabs} value={tab} onChange={setTab} />
        </View>

        <View style={tab === 'trades' ? VISIBLE : HIDDEN}>
          <TradesTab />
        </View>

        <View style={tab === 'orders' ? VISIBLE : HIDDEN}>
          <OrdersTab />
        </View>

        <View style={tab === 'statements' ? VISIBLE : HIDDEN}>
          <StatementsTab />
        </View>
      </View>
    </Screen>
  );
}
