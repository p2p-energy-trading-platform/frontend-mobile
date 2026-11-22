import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { smartMeterContent } from '../constants';

type ConnectionTestCardProps = {
  onTest: () => void;
};

/** Card with a "Test" button that checks the meter is reachable (Figma: Connection Test). */
export function ConnectionTestCard({ onTest }: ConnectionTestCardProps) {
  const { theme } = useTheme();

  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border p-3"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: theme.surfaceSecondary }}
      >
        <Icon name="wifi" size={15} color={theme.textSecondary} />
      </View>

      <View className="flex-1 gap-0.5">
        <AppText preset="bodySemibold">{smartMeterContent.testTitle}</AppText>

        <AppText preset="caption" tone="textPlaceholder">
          {smartMeterContent.testDescription}
        </AppText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={smartMeterContent.testTitle}
        onPress={onTest}
        className="rounded-xl border px-4 py-2"
        style={{ backgroundColor: theme.surface, borderColor: theme.borderInput }}
      >
        <AppText preset="label" tone="textSecondary">
          {smartMeterContent.testAction}
        </AppText>
      </Pressable>
    </View>
  );
}
