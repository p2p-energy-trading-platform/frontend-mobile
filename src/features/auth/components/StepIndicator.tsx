import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type StepIndicatorProps = {
  /** Current step, starting at 1. */
  step: number;
  total: number;
};

/** "Step 1 of 4" with a row of progress pills (Figma: Step Indicator). */
export function StepIndicator({ step, total }: StepIndicatorProps) {
  const { theme } = useTheme();

  return (
    <View
      accessible
      accessibilityLabel={`Step ${step} of ${total}`}
      className="items-center justify-center gap-1.5"
    >
      <AppText preset="labelMedium" tone="textSecondary">
        {`Step ${step} of ${total}`}
      </AppText>

      <View className="flex-row items-center gap-1.5">
        {Array.from({ length: total }, (_, index) => {
          const current = index === step - 1;

          return (
            <View
              key={`step-${index + 1}`}
              className={`h-2 rounded-full ${current ? 'w-6' : 'w-2'}`}
              style={{ backgroundColor: current ? theme.accent : theme.border }}
            />
          );
        })}
      </View>
    </View>
  );
}
