import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;

  containerStyle?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;
}
export function Button({
  title,
  containerStyle,
  textStyle,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      className="items-center justify-center rounded-xl px-5 py-3"
      style={[
        {
          backgroundColor: theme.primary,
        },
        containerStyle,
      ]}
      {...props}
    >
      <AppText
        style={[
          {
            color: theme.primaryForeground,
          },
          textStyle,
        ]}
      >
        {title}
      </AppText>
    </Pressable>
  );
}