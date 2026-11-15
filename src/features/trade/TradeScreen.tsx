import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/AppShell';

import { HistoryLinkRow } from './components/HistoryLinkRow';

export default function TradeScreen() {
  const router = useRouter();

  return (
    <AppShell unreadCount={3} initials="SA">
      <ScrollView className="flex-1" contentContainerClassName="gap-3 px-4 py-4">
        {/* Teammate's trade components go here */}

        <HistoryLinkRow
          label="Open History"
          count={2}
          summary="Sell 0.390 · Buy 0.360"
          onPress={() => router.push('/history')}
        />
      </ScrollView>
    </AppShell>
  );
}
