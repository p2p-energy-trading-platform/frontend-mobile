import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type MetricCardProps = {
  value: string;
  label: string;
  note: string;
};

export function MetricCard({
  value,
  label,
  note,
}: MetricCardProps) {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="gap-1">
        <AppText variant="heading">
          {value}
        </AppText>

        <AppText
          variant="body"
          style={{
            color: theme.textSecondary,
          }}
        >
          {label}
        </AppText>

        <AppText
          variant="caption"
          style={{
            color: theme.textSecondary,
          }}
        >
          {note}
        </AppText>
      </View>
    </Card>
  );
}