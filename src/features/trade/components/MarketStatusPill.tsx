import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import type { MarketStatus } from '../types';

export function MarketStatusPill({ status }: { status: MarketStatus }) {
  const { theme } = useTheme();
  const open = status === 'open';
  const colors = open ? theme.feedback.success : theme.feedback.error;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Market ${open ? 'open' : 'closed'}`}
      className="h-9 flex-row items-center gap-1.5 rounded-full border px-3"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: colors.icon }} />
      <AppText
        className="text-xs"
        style={{ color: colors.text, fontFamily: FontFamily.bodySemibold }}
      >
        Market {open ? 'Open' : 'Closed'}
      </AppText>
    </View>
  );
}
