import { useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import type { KeyboardTypeOptions, StyleProp, TextInputProps, ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { Input } from '@/shared/components/ui/Input';
import { Screen } from '@/shared/components/ui/Screen';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Typography } from '@/shared/design-system/tokens';

type AuthLayoutProps = {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

export function AuthLayout({ children, contentStyle }: AuthLayoutProps) {
  return (
    <Screen>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={[
            { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28 },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center gap-2">
      <View
        className={
          compact
            ? 'h-8 w-8 items-center justify-center rounded-xl'
            : 'h-10 w-10 items-center justify-center rounded-2xl'
        }
        style={{ backgroundColor: theme.accent }}
      >
        <Icon name="bolt" size={compact ? 18 : 22} color={theme.accentForeground} />
      </View>
      <AppText variant="title">GridX</AppText>
    </View>
  );
}

export function AuthHeading({
  title,
  subtitle,
  centered = false,
}: {
  title: string;
  subtitle: string;
  centered?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <View className="gap-2">
      <AppText
        variant="heading"
        style={{ fontSize: 28, lineHeight: 34, textAlign: centered ? 'center' : 'left' }}
      >
        {title}
      </AppText>
      <AppText
        style={{
          color: theme.textSecondary,
          lineHeight: 22,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {subtitle}
      </AppText>
    </View>
  );
}

export function TextField({
  label,
  helper,
  error,
  keyboardType,
  ...inputProps
}: TextInputProps & {
  label: string;
  helper?: string;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
}) {
  const { theme } = useTheme();

  return (
    <View className="gap-2">
      <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
        {label}
      </AppText>
      <Input
        {...inputProps}
        keyboardType={keyboardType}
        placeholderTextColor={theme.textTertiary}
        style={[
          {
            height: 50,
            borderWidth: 1,
            borderColor: error ? theme.error : theme.border,
            borderRadius: 14,
            paddingHorizontal: 16,
            backgroundColor: theme.inputBackground,
            fontSize: Typography.fontSize.sm,
          },
          inputProps.style,
        ]}
      />
      {error ? (
        <AppText variant="caption" style={{ color: theme.error }}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" style={{ color: theme.textTertiary }}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}

export function PasswordField({
  label = 'Password',
  error,
  helper,
  value,
  onChangeText,
  onBlur,
  placeholder = 'Enter password',
}: {
  label?: string;
  error?: string;
  helper?: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: TextInputProps['onBlur'];
  placeholder?: string;
}) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View className="gap-2">
      <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
        {label}
      </AppText>
      <View className="justify-center">
        <Input
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            height: 50,
            borderWidth: 1,
            borderColor: error ? theme.error : theme.border,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingRight: 56,
            backgroundColor: theme.inputBackground,
            fontSize: Typography.fontSize.sm,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={10}
          onPress={() => setVisible((current) => !current)}
          className="absolute right-4"
        >
          <Icon
            name={visible ? 'visibility-off' : 'visibility'}
            size={20}
            color={theme.textTertiary}
          />
        </Pressable>
      </View>
      {error ? (
        <AppText variant="caption" style={{ color: theme.error }}>
          {error}
        </AppText>
      ) : helper ? (
        <AppText variant="caption" style={{ color: theme.textTertiary }}>
          {helper}
        </AppText>
      ) : null}
    </View>
  );
}

export function CheckBox({
  checked,
  onPress,
  label,
  richTerms = false,
}: {
  checked: boolean;
  onPress: () => void;
  label?: string;
  richTerms?: boolean;
}) {
  const { theme } = useTheme();

  const showPolicy = (name: string) =>
    Alert.alert(name, 'Policy details will be available in the app soon.');

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      className="flex-row items-start gap-3"
    >
      <View
        className="mt-0.5 h-5 w-5 items-center justify-center rounded-md border"
        style={{
          borderColor: checked ? theme.accent : theme.borderStrong,
          backgroundColor: checked ? theme.accent : theme.surface,
        }}
      >
        {checked ? <Icon name="check" size={15} color={theme.accentForeground} /> : null}
      </View>
      {richTerms ? (
        <View className="flex-1 flex-row flex-wrap">
          <AppText variant="caption">I agree to the </AppText>
          <Pressable
            accessibilityRole="link"
            onPress={(event) => {
              event.stopPropagation();
              showPolicy('Terms of Service');
            }}
          >
            <AppText
              variant="caption"
              style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
            >
              Terms of Service
            </AppText>
          </Pressable>
          <AppText variant="caption"> and </AppText>
          <Pressable
            accessibilityRole="link"
            onPress={(event) => {
              event.stopPropagation();
              showPolicy('Privacy Policy');
            }}
          >
            <AppText
              variant="caption"
              style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
            >
              Privacy Policy
            </AppText>
          </Pressable>
          <AppText variant="caption">.</AppText>
        </View>
      ) : (
        <AppText variant="caption" style={{ flex: 1, lineHeight: 20 }}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}

export function Divider({ label = 'or continue with' }: { label?: string }) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center gap-3">
      <View className="h-px flex-1" style={{ backgroundColor: theme.divider }} />
      <AppText variant="caption" style={{ color: theme.textTertiary }}>
        {label}
      </AppText>
      <View className="h-px flex-1" style={{ backgroundColor: theme.divider }} />
    </View>
  );
}

export function StepHeader({ step, onBack }: { step: number; onBack: () => void }) {
  const { theme } = useTheme();

  return (
    <View className="gap-5">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Icon name="arrow-back" size={22} color={theme.text} />
        </Pressable>
        <AppText
          variant="caption"
          style={{ color: theme.textSecondary, fontWeight: Typography.fontWeight.medium }}
        >
          Step {step} of 4
        </AppText>
        <View className="h-10 w-10" />
      </View>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4].map((segment) => (
          <View
            key={segment}
            className="h-1.5 flex-1 rounded-full"
            style={{ backgroundColor: segment <= step ? theme.accent : theme.border }}
          />
        ))}
      </View>
    </View>
  );
}

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const { theme } = useTheme();
  const inputs = useRef<Array<TextInput | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index]?.trim() ?? '');
  const update = (next: string[]) => onChange(next.map((digit) => digit || ' ').join(''));

  const changeAt = (index: number, text: string) => {
    const incoming = text.replace(/\D/g, '');
    const next = Array.from({ length }, (_, digitIndex) => value[digitIndex]?.trim() ?? '');

    if (incoming.length > 1) {
      incoming
        .slice(0, length - index)
        .split('')
        .forEach((digit, offset) => {
          next[index + offset] = digit;
        });
      update(next);
      inputs.current[Math.min(index + incoming.length, length - 1)]?.focus();
      return;
    }

    if (!incoming) {
      next[index] = '';
      update(next);
      return;
    }

    next[index] = incoming.charAt(0);
    update(next);
    if (index < length - 1) inputs.current[index + 1]?.focus();
  };

  return (
    <View className="flex-row justify-between gap-2">
      {Array.from({ length }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputs.current[index] = ref;
          }}
          accessibilityLabel={`Verification code digit ${index + 1}`}
          value={digits[index]}
          onChangeText={(text) => changeAt(index, text)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace' && !digits[index] && index > 0)
              inputs.current[index - 1]?.focus();
          }}
          keyboardType="number-pad"
          maxLength={length}
          selectTextOnFocus
          className="h-14 flex-1 rounded-xl border text-center text-xl font-semibold"
          style={{
            backgroundColor: theme.inputBackground,
            borderColor: digits[index] ? theme.accent : theme.border,
            color: theme.text,
            fontSize: Typography.fontSize.xl,
          }}
        />
      ))}
    </View>
  );
}

export function SelectField({
  label,
  placeholder,
  value,
  options,
  onSelect,
}: {
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View className="gap-2">
      <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
        {label}
      </AppText>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        className="h-[50px] flex-row items-center justify-between rounded-[14px] border px-4"
        style={{ backgroundColor: theme.inputBackground, borderColor: theme.border }}
      >
        <AppText variant="caption" style={{ color: value ? theme.text : theme.textTertiary }}>
          {value || placeholder}
        </AppText>
        <Icon name="keyboard-arrow-down" size={20} color={theme.textTertiary} />
      </Pressable>
      <Modal transparent visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setOpen(false)}
          style={{ backgroundColor: theme.overlay }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="max-h-[70%] rounded-t-3xl px-5 pb-8 pt-5"
            style={{ backgroundColor: theme.surface }}
          >
            <View
              className="mb-4 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: theme.borderStrong }}
            />
            <AppText variant="title" style={{ marginBottom: 16 }}>
              {label}
            </AppText>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                  className="flex-row items-center justify-between border-b py-4"
                  style={{ borderColor: theme.divider }}
                >
                  <AppText>{option}</AppText>
                  {value === option ? <Icon name="check" size={20} color={theme.accent} /> : null}
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function DateField({
  value,
  onChange,
  onBlur,
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur?: TextInputProps['onBlur'];
}) {
  const { theme } = useTheme();
  const pieces = value.split('/');

  const updatePiece = (index: number, text: string) => {
    const maxLength = index === 2 ? 4 : 2;
    const cleaned = text.replace(/\D/g, '').slice(0, maxLength);
    const next = [pieces[0] ?? '', pieces[1] ?? '', pieces[2] ?? ''];
    next[index] = cleaned;
    onChange(next.join('/'));
  };

  return (
    <View className="gap-2">
      <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
        Date of birth
      </AppText>
      <View className="flex-row items-center gap-2">
        {(['DD', 'MM', 'YYYY'] as const).map((placeholder, index) => (
          <View key={placeholder} className="flex-1">
            <Input
              accessibilityLabel={placeholder}
              value={pieces[index] ?? ''}
              onChangeText={(text) => updatePiece(index, text)}
              onBlur={onBlur}
              placeholder={placeholder}
              keyboardType="number-pad"
              maxLength={index === 2 ? 4 : 2}
              style={{
                height: 50,
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 14,
                paddingHorizontal: 12,
                textAlign: 'center',
                backgroundColor: theme.inputBackground,
                fontSize: Typography.fontSize.sm,
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

export function InlineLink({ children, onPress }: { children: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={6}>
      <AppText
        variant="caption"
        style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
      >
        {children}
      </AppText>
    </Pressable>
  );
}

export function SectionLabel({ title, hint }: { title: string; hint?: string }) {
  const { theme } = useTheme();
  return (
    <View className="flex-row items-end justify-between">
      <AppText variant="body" style={{ fontWeight: Typography.fontWeight.semibold }}>
        {title}
      </AppText>
      {hint ? (
        <AppText variant="caption" style={{ color: theme.textTertiary }}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
}

export function AuthButton({
  title,
  disabled,
  onPress,
}: {
  title: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return <Button title={title} variant="accent" disabled={disabled} onPress={onPress} />;
}
