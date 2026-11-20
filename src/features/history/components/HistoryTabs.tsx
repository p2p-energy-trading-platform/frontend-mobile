import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { HistoryTab, HistoryTabOption } from '../types';

type HistoryTabsProps = {
  options: readonly HistoryTabOption[];
  value: HistoryTab;
  onChange: (value: HistoryTab) => void;
};

// kept as a style object on purpose: class-based layout on this Pressable crashed on tab change
const SEGMENT = { flex: 1, borderRadius: 12, minHeight: 28 } as const;

/** Trades / Orders / Statements switch (Figma: Container with 3 Buttons). */
export function HistoryTabs({ options, value, onChange }: HistoryTabsProps) {
  const { theme } = useTheme();

  return (
    <View
      className="h-11 flex-row gap-0.5 rounded-2xl p-1"
      style={{ backgroundColor: theme.surfaceSecondary }}
    >
      {options.map((option) => {
        const active = option.value === value;
        const color = active ? theme.text : theme.textDisabled;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            className="items-center justify-center"
            style={[SEGMENT, active && { backgroundColor: theme.surface }]}
          >
            <View className="flex-row items-center justify-center gap-1.5">
              <Icon name={option.icon} size={13} color={color} />

              <Text className="font-body-semibold text-sm" style={{ color }}>
                {option.label}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
