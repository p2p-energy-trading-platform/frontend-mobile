import { View } from 'react-native';

import { Card } from '@/shared/components/ui/Card';
import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { activities } from '../constants';
import { ActivityItem } from './ActivityItem';

export function ActivityList() {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <AppText variant="title">Live Activity</AppText>

          <AppText
            variant="caption"
            style={{
              color: theme.textSecondary,
            }}
          >
            Updated now
          </AppText>
        </View>

        {activities.map((activity) => (
          <ActivityItem key={activity.title} title={activity.title} detail={activity.detail} />
        ))}
      </View>
    </Card>
  );
}
