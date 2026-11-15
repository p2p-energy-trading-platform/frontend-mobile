import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { HistoryTab, HistoryTabOption } from '../types';

type HistoryTabsProps = {
  options: readonly HistoryTabOption[];
  value: HistoryTab;
  onChange: (value: HistoryTab) => void;
};

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
            className={`min-h-7 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl px-2.5 ${
              active ? 'shadow-sm' : ''
            }`}
            style={active ? { backgroundColor: theme.surface } : undefined}
          >
            <Icon name={option.icon} size={13} color={color} />

            <Text className="font-body-semibold text-sm" style={{ color }}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
