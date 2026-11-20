import { useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { Icon } from './Icon';
import type { Option } from './types';

type FilterDropdownProps<T extends string> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel?: string;
};

type Anchor = { x: number; y: number; width: number; height: number };

/** Compact dropdown: trigger button + floating menu with a check on the selected option. */
export function FilterDropdown<T extends string>({
  options,
  value,
  onChange,
  accessibilityLabel = 'Filter',
}: FilterDropdownProps<T>) {
  const { theme } = useTheme();

  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  const selected = options.find((option) => option.value === value);

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
    });
  };

  const close = () => setAnchor(null);

  const select = (next: T) => {
    onChange(next);
    close();
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        collapsable={false}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}: ${selected?.label ?? ''}`}
        accessibilityState={{ expanded: anchor !== null }}
        onPress={open}
        className="h-9 flex-row items-center gap-2 rounded-xl border px-3.5"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <Icon name="list-filter" size={16} color={theme.text} />

        <Text className="font-body-medium text-xs" style={{ color: theme.text }}>
          {selected?.label}
        </Text>

        <Icon name="keyboard-arrow-down" size={16} color={theme.textTertiary} />
      </Pressable>

      <Modal
        transparent
        statusBarTranslucent
        animationType="fade"
        visible={anchor !== null}
        onRequestClose={close}
      >
        <Pressable className="flex-1" accessibilityLabel="Close filter menu" onPress={close}>
          {anchor ? (
            <View
              className="absolute overflow-hidden rounded-xl border shadow-lg"
              style={{
                top: anchor.y + anchor.height + 4,
                left: anchor.x,
                minWidth: Math.max(anchor.width, 140),
                backgroundColor: theme.surface,
                borderColor: theme.border,
              }}
            >
              {options.map((option, index) => {
                const active = option.value === value;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="menuitem"
                    accessibilityState={{ selected: active }}
                    onPress={() => select(option.value)}
                    className="flex-row items-center justify-between gap-4 px-3.5 py-2.5"
                    style={
                      index < options.length - 1
                        ? { borderBottomWidth: 1, borderBottomColor: theme.borderSubtle }
                        : undefined
                    }
                  >
                    <Text
                      className={active ? 'font-body-semibold text-sm' : 'font-body-medium text-sm'}
                      style={{ color: active ? theme.text : theme.textSecondary }}
                    >
                      {option.label}
                    </Text>

                    <View className="h-4 w-4 items-center justify-center">
                      {active ? <Icon name="check" size={14} color={theme.accent} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}
