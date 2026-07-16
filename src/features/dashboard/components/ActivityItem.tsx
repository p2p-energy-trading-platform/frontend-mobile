import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type ActivityItemProps = {
  title: string;
  detail: string;
};

export function ActivityItem({
  title,
  detail,
}: ActivityItemProps) {
  const { theme } = useTheme();

  return (
    <View
      className="flex-row items-center gap-3 border-t pt-3"
      style={{
        borderTopColor: theme.border,
      }}
    >
      <View
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: theme.primary,
        }}
      />

      <View className="flex-1 gap-1">
        <AppText
          variant="body"
          style={{
            fontWeight: '700',
          }}
        >
          {title}
        </AppText>

        <AppText
          variant="caption"
          style={{
            color: theme.textSecondary,
          }}
        >
          {detail}
        </AppText>
      </View>
    </View>
  );
}