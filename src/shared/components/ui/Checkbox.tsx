import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';
import { Icon } from './Icon';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Accessibility label, and the visible text when no `children` are given. */
  label: string;
  /** Rich label shown instead of `label`, e.g. text with inline links. */
  children?: ReactNode;
};

/** Square checkbox with a label (Figma: Remember Me / Terms). */
export function Checkbox({ checked, onChange, label, children }: CheckboxProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={() => onChange(!checked)}
      className="flex-row items-start gap-3"
    >
      <View
        className="mt-px h-5 w-5 items-center justify-center rounded-md"
        style={{
          borderWidth: 1.5,
          borderColor: checked ? theme.accent : theme.borderInput,
          backgroundColor: checked ? theme.accent : theme.surface,
        }}
      >
        {checked ? <Icon name="check" size={14} color={theme.accentForeground} /> : null}
      </View>

      <AppText className="flex-1" preset="bodyRelaxed" tone="textSecondary">
        {children ?? label}
      </AppText>
    </Pressable>
  );
}