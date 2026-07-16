import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function Card({ children, style }: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      className="rounded-2xl p-4"
      style={[
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
