import { useRef, useState } from 'react';
import { TextInput, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { TextStyles } from '@/shared/design-system/tokens';

import { FieldMessage } from './FieldMessage';

type OtpInputProps = {
  /** One character per box; an empty box is a space, so a valid code is only digits. */
  value: string;
  onChange: (value: string) => void;
  length?: number;
  /** Accessibility label prefix: "<label> digit 1", "<label> digit 2", ... */
  label?: string;
  helper?: string;
  error?: string;
};

/** Row of single-digit boxes with paste / autofill, auto-advance and backspace support. */
export function OtpInput({
  value,
  onChange,
  length = 6,
  label = 'Verification code',
  helper,
  error,
}: OtpInputProps) {
  const { theme } = useTheme();
  const inputs = useRef<Array<TextInput | null>>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const digits = Array.from({ length }, (_, index) => value[index]?.trim() ?? '');

  const emit = (next: string[]) => onChange(next.map((digit) => digit || ' ').join(''));

  const changeAt = (index: number, text: string) => {
    const incoming = text.replace(/\D/g, '');
    const next = [...digits];

    // pasted or autofilled code: spread it over the boxes
    if (incoming.length > 1) {
      incoming
        .slice(0, length - index)
        .split('')
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
      emit(next);
      inputs.current[Math.min(index + incoming.length, length - 1)]?.focus();
      return;
    }

    if (!incoming) {
      next[index] = '';
      emit(next);
      return;
    }

    next[index] = incoming.charAt(0);
    emit(next);

    if (index < length - 1) inputs.current[index + 1]?.focus();
  };

  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        {Array.from({ length }, (_, index) => {
          const focused = focusedIndex === index;

          return (
            <TextInput
              key={`digit-${index + 1}`}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              accessibilityLabel={`${label} digit ${index + 1}`}
              value={digits[index]}
              onChangeText={(text) => changeAt(index, text)}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
                  inputs.current[index - 1]?.focus();
                }
              }}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex((current) => (current === index ? null : current))}
              keyboardType="number-pad"
              maxLength={length}
              selectTextOnFocus
              textContentType={index === 0 ? 'oneTimeCode' : undefined}
              autoComplete={index === 0 ? 'sms-otp' : 'off'}
              selectionColor={theme.accent}
              cursorColor={theme.accent}
              className="h-14 flex-1 rounded-xl text-center"
              style={{
                ...TextStyles.otpDigit,
                color: theme.text,
                backgroundColor: theme.surface,
                borderWidth: focused ? 1.5 : 1,
                borderColor: error ? theme.error : focused ? theme.accent : theme.borderInput,
                paddingVertical: 0,
              }}
            />
          );
        })}
      </View>

      <FieldMessage error={error} helper={helper} />
    </View>
  );
}
