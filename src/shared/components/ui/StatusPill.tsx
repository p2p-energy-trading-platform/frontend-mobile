import { View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AppText } from './AppText';

export type Status = 'Settled' | 'Pending' | 'Failed';

export function StatusPill({ status }: { status: Status }) {
  const { theme } = useTheme();
  const colors = {
    Settled: theme.feedback.success,
    Pending: theme.feedback.warning,
    Failed: theme.feedback.error,
  }[status];

  return (
    <View
      className="self-start rounded-full border px-2 py-1"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <AppText style={{ color: colors.text, fontSize: 11, lineHeight: 14 }}>{status}</AppText>
    </View>
  );
}
