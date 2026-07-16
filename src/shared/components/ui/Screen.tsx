import { PropsWithChildren } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, style }: ScreenProps) {
    const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'right', 'bottom', 'left']}
      className="flex-1"
      style={[
        {
          backgroundColor: theme.background,
        },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}