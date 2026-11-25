import { Modal, Pressable, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';
import { Button } from './Button';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { theme } = useTheme();

  return (
    <Modal
      transparent
      statusBarTranslucent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable
        accessibilityLabel="Dismiss dialog"
        onPress={onCancel}
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: theme.overlay }}
      >
        <Pressable
          accessibilityViewIsModal
          accessibilityRole="alert"
          onPress={(event) => event.stopPropagation()}
          className="w-full max-w-sm gap-2 rounded-2xl border p-5"
          style={{ backgroundColor: theme.surface, borderColor: theme.border }}
        >
          <AppText className="font-body-semibold text-lg">{title}</AppText>
          <AppText className="text-sm" style={{ color: theme.textSecondary }}>
            {message}
          </AppText>

          <View className="mt-3 flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              className="h-12 flex-1 items-center justify-center rounded-xl border"
              style={{ borderColor: theme.border }}
            >
              <AppText className="font-body-semibold text-sm" style={{ color: theme.text }}>
                {cancelLabel}
              </AppText>
            </Pressable>
            <View className="flex-1">
              <Button
                title={confirmLabel}
                variant={destructive ? 'destructive' : 'primary'}
                onPress={onConfirm}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
