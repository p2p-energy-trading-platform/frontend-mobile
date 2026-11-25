import { PropsWithChildren } from 'react';
import { Text, TextProps } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import type { Theme } from '@/shared/design-system/themes/types';
import { TextStyles } from '@/shared/design-system/tokens';

type Variant = 'display' | 'heading' | 'title' | 'body' | 'caption';

/** Theme colours a piece of text can use. */
type Tone = Extract<
  keyof Theme,
  'text' | 'textSecondary' | 'textTertiary' | 'textPlaceholder' | 'accent' | 'error'
>;

interface AppTextProps extends PropsWithChildren, TextProps {
  variant?: Variant;
  /** Ready-made font + size + line height from `TextStyles`. Replaces `variant` when given. */
  preset?: keyof typeof TextStyles;
  /** Theme colour of the text. Defaults to `text`. */
  tone?: Tone;
}

export function AppText({
  children,
  variant = 'body',
  preset,
  tone = 'text',
  style,
  ...props
}: AppTextProps) {
  const { theme } = useTheme();

  const classes = {
    display: 'text-4xl font-extrabold',
    heading: 'text-3xl font-bold',
    title: 'text-xl font-bold',
    body: 'text-base',
    caption: 'text-sm',
  };

  return (
    <Text
      className={preset ? undefined : classes[variant]}
      style={[
        preset && TextStyles[preset],
        {
          color: theme[tone],
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
