import { useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';
import { FieldMessage } from './FieldMessage';
import { Icon } from './Icon';
import type { Option } from './types';

type SelectFieldProps<T extends string> = {
  label: string;
  placeholder: string;
  options: readonly Option<T>[];
  /** Selected value, or an empty string when nothing is selected. */
  value: string;
  onChange: (value: T) => void;
  error?: string;
};

/** Label + bordered select that opens a bottom sheet of options (Figma: Field / Select). */
export function SelectField<T extends string>({
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: SelectFieldProps<T>) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  const select = (next: T) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <View className="gap-2">
      <AppText preset="label" tone="textSecondary">
        {label}
      </AppText>

      {/* height and radius match FormControl (52 / Radius.lg) used by TextField */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.label ?? placeholder}`}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(true)}
        className="h-[52px] flex-row items-center gap-2 rounded-2xl border px-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: error ? theme.error : theme.borderInput,
        }}
      >
        <AppText
          className="flex-1"
          preset="input"
          numberOfLines={1}
          tone={selected ? 'text' : 'textPlaceholder'}
        >
          {selected?.label ?? placeholder}
        </AppText>

        <Icon name="keyboard-arrow-down" size={16} color={theme.textPlaceholder} />
      </Pressable>

      <FieldMessage error={error} />

      <Modal
        transparent
        statusBarTranslucent
        animationType="slide"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1" style={{ backgroundColor: theme.overlay }}>
          <Pressable
            className="flex-1"
            accessibilityLabel={`Close ${label} options`}
            onPress={() => setOpen(false)}
          />

          <View
            className="max-h-[70%] rounded-t-3xl border-t px-5 pt-4"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              paddingBottom: insets.bottom + 16,
            }}
          >
            <AppText accessibilityRole="header" preset="bodySemibold" className="pb-2">
              {label}
            </AppText>

            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: active }}
                    onPress={() => select(option.value)}
                    className="flex-row items-center justify-between py-3"
                  >
                    <AppText
                      preset={active ? 'bodySemibold' : 'body'}
                      tone={active ? 'text' : 'textSecondary'}
                    >
                      {option.label}
                    </AppText>

                    {active ? <Icon name="check" size={16} color={theme.accent} /> : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
