import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type DateStepperProps = {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

export function DateStepper({ label, onPrevious, onNext, nextDisabled }: DateStepperProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center gap-0.5">
      <Pressable
        accessibilityLabel="Previous period"
        onPress={onPrevious}
        className="items-center justify-center rounded-[10px] p-1.5"
      >
        <Icon name="chevron-left" size={16} color={theme.textSecondary} />
      </Pressable>

      <AppText
        style={{
          color: theme.textSecondary,
          fontSize: 13,
          lineHeight: 18,
          fontFamily: FontFamily.bodyMedium,
        }}
      >
        {label}
      </AppText>

      <Pressable
        accessibilityLabel="Next period"
        disabled={nextDisabled}
        onPress={onNext}
        className="items-center justify-center rounded-[10px] p-1.5"
        style={{ opacity: nextDisabled ? 0.35 : 1 }}
      >
        <Icon name="chevron-right" size={16} color={theme.textSecondary} />
      </Pressable>
    </View>
  );
}
