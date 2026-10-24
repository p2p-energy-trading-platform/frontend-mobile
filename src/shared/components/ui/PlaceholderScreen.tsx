import { View } from 'react-native';

import { AppShell } from '@/shared/components/ui/layout/Appshell';
import { Icon } from '@/shared/components/ui/Icon';

import { AppText } from './AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

export function PlaceholderScreen({ title }: { title: string }) {
  const { theme } = useTheme();

  return (
    <AppShell>
      <View className="flex-1 items-center justify-center gap-3">
        <Icon name="clock-3" size={32} color={theme.textPlaceholder} />
        <AppText variant="title">{title}</AppText>
        <AppText variant="caption" style={{ color: theme.textPlaceholder }}>
          Coming soon
        </AppText>
      </View>
    </AppShell>
  );
}
