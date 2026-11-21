import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

export type TextFieldProps = TextInputProps & {
  label: string;
  labelAction?: ReactNode;
  rightAdornment?: ReactNode;
  helper?: string;
  error?: string;
};

/** Label row + bordered input + helper / error text (Figma: Field). */
export function TextField({
  label,
  labelAction,
  rightAdornment,
  helper,
  error,
  onFocus,
  onBlur,
  ...inputProps
}: TextFieldProps) {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.error : focused ? theme.focusRing : theme.borderInput;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text
          className="text-[13px] leading-[18px]"
          style={{ fontFamily: FontFamily.bodySemibold, color: theme.textSecondary }}
        >
          {label}
        </Text>

        {labelAction}
      </View>

      <View
        className="h-[52px] flex-row items-center gap-2 rounded-2xl border px-4"
        style={{ backgroundColor: theme.surface, borderColor }}
      >
        <TextInput
          accessibilityLabel={label}
          className="flex-1 text-base"
          placeholderTextColor={theme.textPlaceholder}
          selectionColor={theme.accent}
          style={{ fontFamily: FontFamily.body, color: theme.text, paddingVertical: 0 }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...inputProps}
        />

        {rightAdornment}
      </View>

      {error ? (
        <Text
          accessibilityRole="alert"
          className="text-xs"
          style={{ fontFamily: FontFamily.body, color: theme.error }}
        >
          {error}
        </Text>
      ) : helper ? (
        <Text
          className="text-xs"
          style={{ fontFamily: FontFamily.body, color: theme.textPlaceholder }}
        >
          {helper}
        </Text>
      ) : null}
    </View>
  );
}
