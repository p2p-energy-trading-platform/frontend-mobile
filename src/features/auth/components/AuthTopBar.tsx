import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type AuthTopBarProps = {
  onBack: () => void;
  /** Shown on the right: the logo mark or the step indicator. */
  right?: ReactNode;
};

/** Back button on the left, logo mark or step indicator on the right (Figma: Top Bar). */
export function AuthTopBar({ onBack, right }: AuthTopBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        paddingTop: insets.top,
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      <View className="h-14 flex-row items-center justify-between px-6">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
          onPress={onBack}
          className="h-10 w-10 items-center justify-center rounded-full border"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <Icon name="chevron-left" size={20} color={theme.text} />
        </Pressable>

        {right}
      </View>
    </View>
  );
}
