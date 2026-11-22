import type { ComponentProps } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily, FormControl } from '@/shared/design-system/tokens';

type AuthButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>;

/** Full-width accent button used for the main action of an auth screen (Figma: Button / Primary). */
export function AuthButton({ containerStyle, textStyle, disabled, ...props }: AuthButtonProps) {
  const { theme } = useTheme();

  return (
    <Button
      variant="accent"
      disabled={disabled}
      containerStyle={[
        { height: FormControl.height },
        // Figma: the disabled button is the accent button at 45% opacity
        disabled && { backgroundColor: theme.accent, opacity: 0.45 },
        containerStyle,
      ]}
      textStyle={[
        { fontFamily: FontFamily.bodySemibold },
        disabled && { color: theme.accentForeground },
        textStyle,
      ]}
      {...props}
    />
  );
}