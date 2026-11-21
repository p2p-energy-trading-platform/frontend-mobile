import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { LogoMark } from './LogoMark';

type AuthTopBarProps = {
  onBack: () => void;
};

/** Back button on the left, logo mark on the right (Figma: Top Bar). */
export function AuthTopBar({ onBack }: AuthTopBarProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ backgroundColor: theme.surface, paddingTop: insets.top }}>
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

        <LogoMark />
      </View>
    </View>
  );
}
