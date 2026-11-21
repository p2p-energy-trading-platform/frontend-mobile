import type { ComponentProps } from 'react';

import { Button } from '@/shared/components/ui/Button';
import { FontFamily } from '@/shared/design-system/tokens';

type AuthButtonProps = Omit<ComponentProps<typeof Button>, 'variant'>;

/** Full-width accent button used for the main action of an auth screen (Figma: Button / Primary). */
export function AuthButton({ containerStyle, textStyle, ...props }: AuthButtonProps) {
  return (
    <Button
      variant="accent"
      containerStyle={[{ height: 52 }, containerStyle]}
      textStyle={[{ fontFamily: FontFamily.bodySemibold }, textStyle]}
      {...props}
    />
  );
}
