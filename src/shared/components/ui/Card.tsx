import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}>;

export function Card({ children, style, compact = false }: CardProps) {
  const { theme } = useTheme();

  return (
    <View
      className={compact ? 'rounded-2xl p-3.5' : 'rounded-2xl p-4'}
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
