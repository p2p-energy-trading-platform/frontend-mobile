import { Modal, Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type ComingSoonSheetProps = {
  action: string;
  onClose: () => void;
};

export function ComingSoonSheet({ action, onClose }: ComingSoonSheetProps) {
  const { theme } = useTheme();

  return (
    <Modal transparent statusBarTranslucent animationType="slide" visible onRequestClose={onClose}>
      <Pressable
        accessibilityLabel="Close"
        onPress={onClose}
        className="flex-1 justify-end"
        style={{ backgroundColor: theme.overlay }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="gap-4 rounded-t-3xl px-6 pb-8 pt-5"
          style={{ backgroundColor: theme.surface }}
        >
          <View
            className="h-1 w-10 self-center rounded-full"
            style={{ backgroundColor: theme.borderStrong }}
          />
          <View className="flex-row items-center justify-between">
            <AppText className="font-body-semibold text-lg">{action} coming soon</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Close" onPress={onClose}>
              <Icon name="close" size={20} color={theme.textTertiary} />
            </Pressable>
          </View>
          <AppText className="text-sm" style={{ color: theme.textSecondary }}>
            {action} is not available yet. We’ll let you know when it’s ready.
          </AppText>
          <Button title="Got it" onPress={onClose} />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
