import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type MeterTypeOptionProps = {
  title: string;
  description: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
};

/** Selectable card for one meter type (Figma: Option / DEWA Advanced). */
export function MeterTypeOption({
  title,
  description,
  icon,
  selected,
  onPress,
}: MeterTypeOptionProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-1 gap-2 overflow-hidden rounded-2xl border p-4"
      style={{
        backgroundColor: theme.surface,
        borderColor: selected ? theme.accent : theme.borderInput,
        borderWidth: selected ? 1.5 : 1,
      }}
    >
      {/* Figma: the selected card has the accent colour at 8% over the surface (14 is 8% in hex) */}
      {selected ? (
        <View
          pointerEvents="none"
          className="absolute inset-0"
          style={{ backgroundColor: `${theme.accent}14` }}
        />
      ) : null}

      <View
        className="h-8 w-8 items-center justify-center rounded-xl"
        style={{ backgroundColor: theme.surfaceSecondary }}
      >
        <Icon name={icon} size={15} color={selected ? theme.accent : theme.textSecondary} />
      </View>

      <View className="gap-0.5">
        <AppText preset="bodySemibold">{title}</AppText>

        <AppText preset="caption" tone="textPlaceholder">
          {description}
        </AppText>
      </View>
    </Pressable>
  );
}
