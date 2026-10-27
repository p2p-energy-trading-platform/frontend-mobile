import { Pressable, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { AppText } from './AppText';

type Option<T extends string> = { label: string; value: T };

type SegmentedControlProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** md = full width view switch, sm = compact period pills */
  size?: 'md' | 'sm';
};

const SIZES = {
  md: {
    container: { padding: 4, borderRadius: 14, gap: 4 },
    segment: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, flex: 1 },
    text: { fontSize: 14, lineHeight: 20 },
  },
  sm: {
    container: { padding: 3, borderRadius: 12, gap: 2, alignSelf: 'flex-start' as const },
    segment: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 9 },
    text: { fontSize: 12, lineHeight: 16 },
  },
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) {
  const { theme } = useTheme();
  const s = SIZES[size];

  return (
    <View
      className="flex-row items-center border"
      style={[s.container, { backgroundColor: theme.surface, borderColor: theme.border }]}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            className="items-center justify-center"
            style={[s.segment, active && { backgroundColor: theme.surfaceSecondary }]}
          >
            <AppText
              style={[
                s.text,
                {
                  color: active ? theme.text : theme.textPlaceholder,
                  fontFamily: active ? FontFamily.bodySemibold : FontFamily.bodyMedium,
                },
              ]}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
