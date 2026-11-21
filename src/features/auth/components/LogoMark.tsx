import { View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

/** GridX bolt mark (Figma: Logo Mark). */
export function LogoMark() {
  const { theme } = useTheme();

  return (
    <View
      accessibilityLabel="GridX"
      className="h-8 w-8 items-center justify-center rounded-xl"
      style={{
        backgroundColor: theme.accent,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1.5,
        elevation: 2,
      }}
    >
      <Icon name="bolt" size={15} color={theme.accentForeground} />
    </View>
  );
}
