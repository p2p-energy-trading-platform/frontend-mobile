import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { Icon } from './Icon';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

/** Square checkbox with a label (Figma: Remember Me). */
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={label}
      accessibilityState={{ checked }}
      hitSlop={8}
      onPress={() => onChange(!checked)}
      className="flex-row items-center gap-3"
    >
      <View
        className="h-5 w-5 items-center justify-center rounded-md"
        style={{
          borderWidth: 1.5,
          borderColor: checked ? theme.accent : theme.borderInput,
          backgroundColor: checked ? theme.accent : theme.surface,
        }}
      >
        {checked ? <Icon name="check" size={14} color={theme.accentForeground} /> : null}
      </View>

      <Text
        className="flex-1 text-sm leading-[22px]"
        style={{ fontFamily: FontFamily.body, color: theme.textSecondary }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
