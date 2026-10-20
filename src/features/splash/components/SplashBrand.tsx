import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Spacing } from '@/shared/design-system/tokens';

export function SplashBrand() {
  const { theme } = useTheme();

  return (
    <View className="items-center gap-4">
      <View
        className="h-20 w-20 items-center justify-center rounded-3xl"
        style={{
          backgroundColor: theme.accent,
        }}
      >
        <Icon name="bolt" size={Spacing[10]} color={theme.accentForeground} />
      </View>

      <AppText
        variant="heading"
        style={{
          textAlign: 'center',
        }}
      >
        GridX
      </AppText>

      <AppText
        style={{
          color: theme.textSecondary,
          textAlign: 'center',
        }}
      >
        Trade solar energy with your neighbours
      </AppText>
    </View>
  );
}

