import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type HistoryHeaderProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
};

/** Back button + page title + subtitle (Figma: HistoryView heading). */
export function HistoryHeader({ title, subtitle, onBack }: HistoryHeaderProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center gap-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={8}
        onPress={onBack}
        className="-ml-2 h-10 w-10 items-center justify-center rounded-xl"
      >
        <Icon name="arrow-back" size={22} color={theme.text} />
      </Pressable>

      <View>
        <Text className="font-heading text-xl leading-7" style={{ color: theme.text }}>
          {title}
        </Text>

        {subtitle ? (
          <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
