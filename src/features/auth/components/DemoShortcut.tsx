import { Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { TextLink } from '@/shared/components/ui/TextLink';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { demoShortcut } from '../constants';

type DemoShortcutProps = {
  onPress: () => void;
};

/** "Demo shortcut: Skip to portal →" row (Figma: Demo Shortcut). Remove once real auth is live. */
export function DemoShortcut({ onPress }: DemoShortcutProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row items-center justify-center gap-1 px-6 pt-3">
      <Text
        className="text-xs"
        style={{ fontFamily: FontFamily.body, color: theme.textPlaceholder }}
      >
        {demoShortcut.prompt}
      </Text>

      <TextLink size="xs" label={demoShortcut.action} onPress={onPress} />

      <Icon name="arrow-forward" size={11} color={theme.accent} />
    </View>
  );
}
