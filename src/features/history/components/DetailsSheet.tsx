import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { DetailRow } from '../types';

type DetailsSheetProps = {
  visible: boolean;
  title: string;
  rows: readonly DetailRow[];
  onClose: () => void;
};

/** Bottom sheet listing the details of one trade or order. */
export function DetailsSheet({ visible, title, rows, onClose }: DetailsSheetProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1" style={{ backgroundColor: theme.overlay }}>
        <Pressable className="flex-1" accessibilityLabel="Close details" onPress={onClose} />

        <View
          className="rounded-t-3xl border-t px-5 pt-4"
          style={{
            backgroundColor: theme.surface,
            borderColor: theme.border,
            paddingBottom: insets.bottom + 16,
          }}
        >
          <View className="flex-row items-center justify-between pb-2">
            <Text className="font-heading text-lg leading-7" style={{ color: theme.text }}>
              {title}
            </Text>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
              onPress={onClose}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <Icon name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          {rows.map((row, index) => (
            <View
              key={row.label}
              className={`flex-row items-center justify-between py-3 ${
                index < rows.length - 1 ? 'border-b' : ''
              }`}
              style={{ borderColor: theme.border }}
            >
              <Text className="font-body text-xs" style={{ color: theme.textTertiary }}>
                {row.label}
              </Text>

              <Text className="font-body-semibold text-sm" style={{ color: theme.text }}>
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}
