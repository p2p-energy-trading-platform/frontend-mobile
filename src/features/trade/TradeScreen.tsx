import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { PageHeader } from '@/shared/components/ui/PageHeader';
import { AppShell } from '@/shared/components/ui/layout/AppShell';

import { HistoryButton } from './components/HistoryButton';
import { MarketStatusPill } from './components/MarketStatusPill';
import { MarketSummaryCard } from './components/MarketSummaryCard';
import { OrderBookCard } from './components/OrderBookCard';
import { OrderPanel } from './components/OrderPanel';
import { PriceChartCard } from './components/PriceChartCard';
import { tradeHeader, tradeSlots } from './constants';
import { useMarket } from './hooks';

export default function TradeScreen() {
  const snapshot = useMarket();
  const [slot, setSlot] = useState(tradeSlots[0]?.value ?? '');
  const slotLabel = tradeSlots.find((option) => option.value === slot)?.label ?? '';

  return (
    <AppShell unreadCount={tradeHeader.unreadCount} initials={tradeHeader.initials}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-3 px-6 pb-6 pt-3"
        >
          <View className="flex-row items-start justify-between">
            <PageHeader title={tradeHeader.title} subtitle={tradeHeader.subtitle} />
            <HistoryButton />
          </View>

          <View className="flex-row items-center justify-between">
            <FilterDropdown
              icon="clock-3"
              accessibilityLabel="Delivery slot"
              options={tradeSlots}
              value={slot}
              onChange={setSlot}
            />
            <MarketStatusPill status={snapshot.status} />
          </View>

          <MarketSummaryCard snapshot={snapshot} />
          <PriceChartCard />
          <OrderPanel slotLabel={slotLabel} />
          <OrderBookCard />
        </ScrollView>
      </KeyboardAvoidingView>
    </AppShell>
  );
}
