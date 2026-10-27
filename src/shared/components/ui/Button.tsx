import { Pressable, PressableProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'accent';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;

  variant?: Variant;

  containerStyle?: StyleProp<ViewStyle>;

  textStyle?: StyleProp<TextStyle>;
}
export function Button({
  title,
  variant = 'primary',
  containerStyle,
  textStyle,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const disabled = Boolean(props.disabled);

  const colors = {
    primary: {
      background: theme.primary,
      foreground: theme.primaryForeground,
    },
    accent: {
      background: theme.accent,
      foreground: theme.accentForeground,
    },
  };

  return (
    <Pressable
      className="h-12 items-center justify-center rounded-xl px-5"
      style={[
        {
          backgroundColor: disabled ? theme.surfaceSecondary : colors[variant].background,
        },
        containerStyle,
      ]}
      {...props}
    >
      <AppText
        style={[
          {
            color: disabled ? theme.textDisabled : colors[variant].foreground,
          },
          textStyle,
        ]}
      >
        {title}
      </AppText>
    </Pressable>
  );
}
