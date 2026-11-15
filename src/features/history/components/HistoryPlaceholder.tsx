import { Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

type HistoryPlaceholderProps = {
  title: string;
};

export function HistoryPlaceholder({ title }: HistoryPlaceholderProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-1 items-center justify-center gap-1 pb-16">
      <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
        {title}
      </Text>

      <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
        Coming soon
      </Text>
    </View>
  );
}
