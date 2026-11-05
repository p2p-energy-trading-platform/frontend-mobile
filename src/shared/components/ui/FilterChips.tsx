import { Pressable, ScrollView } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { AppText } from './AppText';
import type { Option } from './types';

type FilterChipsProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Left/right inset of the scroll content so chips line up with the page gutter. */
  gutter?: number;
};

/** Horizontally scrollable pill filters (Figma: "Filter Chips"). */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  gutter = 24,
}: FilterChipsProps<T>) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: gutter }}
      style={{ flexGrow: 0 }}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            className="items-center justify-center rounded-full border px-3.5 py-1.5"
            style={{
              backgroundColor: active ? theme.surfaceSecondary : 'transparent',
              borderColor: active ? 'transparent' : theme.border,
            }}
          >
            <AppText
              style={{
                color: active ? theme.text : theme.textTertiary,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: active ? FontFamily.bodySemibold : FontFamily.bodyMedium,
              }}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
