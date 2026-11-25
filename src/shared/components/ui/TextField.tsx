import { useState, type ReactNode } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FormControl, TextStyles } from '@/shared/design-system/tokens';

import { AppText } from './AppText';
import { FieldMessage } from './FieldMessage';

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
        <AppText preset="label" tone="textSecondary">
          {label}
        </AppText>

        {labelAction}
      </View>

      <View
        className="flex-row items-center gap-2 border px-4"
        style={{
          height: FormControl.height,
          borderRadius: FormControl.radius,
          backgroundColor: theme.surface,
          borderColor,
        }}
      >
        <TextInput
          accessibilityLabel={label}
          className="flex-1"
          placeholderTextColor={theme.textPlaceholder}
          selectionColor={theme.accent}
          style={[TextStyles.input, { color: theme.text, paddingVertical: 0 }]}
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

      <FieldMessage error={error} helper={helper} />
    </View>
  );
}
