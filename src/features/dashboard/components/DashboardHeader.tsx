import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

export function DashboardHeader() {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="gap-5">
        <View className="flex-row items-center justify-between">
          <View
            className="flex-row items-center gap-2 rounded-full px-3 py-2"
            style={{ backgroundColor: theme.surfaceAlt }}
          >
            <Icon
              name="home"
              size={18}
              color={theme.primary}
            />

            <AppText variant="caption">
              GridX Mobile
            </AppText>
          </View>

          <View
            className="flex-row items-center gap-2 rounded-full px-3 py-2"
            style={{ backgroundColor: theme.surfaceAlt }}
          >
            <View
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: theme.success }}
            />

            <AppText variant="caption">
              Live Sync
            </AppText>
          </View>
        </View>

        <View className="gap-2">
          <AppText variant="display">
            Operations at a glance
          </AppText>

          <AppText
            style={{
              color: theme.textSecondary,
            }}
          >
            Track active sites, forecast quality, and open alerts in one
            place.
          </AppText>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button title="Review Alerts" />
          </View>

          <View className="flex-1">
            <Button title="Open Map" />
          </View>
        </View>
      </View>
    </Card>
  );
}