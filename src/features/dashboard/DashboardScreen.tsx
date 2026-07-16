import { ScrollView } from 'react-native';

import { Screen } from '@/shared/components/ui/Screen';

import { ActivityList } from './components/ActivityList';
import { DashboardHeader } from './components/DashboardHeader';
import { MetricsList } from './components/MetricList';

export default function DashboardScreen() {
  return (
    <Screen>
      <ScrollView className="flex-1" contentContainerClassName="gap-5 p-5">
        <DashboardHeader />

        <MetricsList />

        <ActivityList />
      </ScrollView>
    </Screen>
  );
}
