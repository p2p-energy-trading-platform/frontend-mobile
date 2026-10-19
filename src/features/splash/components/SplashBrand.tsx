import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

export function SplashBrand() {
  const { theme } = useTheme();

  return (
    <View className="items-center gap-4">
      <View
        className="h-[72px] w-[72px] items-center justify-center rounded-3xl"
        style={{
          backgroundColor: theme.primary,
        }}
      >
        <Icon name="bolt" size={36} color={theme.primaryForeground} />
      </View>

      <AppText
        variant="heading"
        style={{
          fontSize: 32,
          lineHeight: 40,
          textAlign: 'center',
        }}
      >
        GridX
      </AppText>

      <AppText
        style={{
          color: theme.textSecondary,
          fontSize: 15,
          lineHeight: 22,
          textAlign: 'center',
        }}
      >
        Trade solar energy with your neighbours
      </AppText>
    </View>
  );
}
