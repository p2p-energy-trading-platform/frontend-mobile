import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';

import { useOrdersStore } from '@/features/history/store';
import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

/** Header button on the Trade screen that opens History, with the open-order count. */
export function HistoryButton() {
  const { theme } = useTheme();
  const router = useRouter();

  const openCount = useOrdersStore(
    (state) =>
      state.orders.filter((order) => order.status === 'open' || order.status === 'partial').length,
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`History, ${openCount} open orders`}
      hitSlop={6}
      // navigate (not push) so repeat taps don't stack the screen twice
      onPress={() => router.navigate('/history')}
      className="h-9 flex-row items-center gap-1.5 rounded-xl border px-3"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <Icon name="file-text" size={16} color={theme.text} />

      <AppText className="text-xs" style={{ fontFamily: FontFamily.bodySemibold }}>
        History
      </AppText>

      {openCount > 0 ? (
        <View
          className="h-5 min-w-5 items-center justify-center rounded-full px-1.5"
          style={{ backgroundColor: theme.accent }}
        >
          <AppText
            className="text-[11px]"
            style={{ color: theme.accentForeground, fontFamily: FontFamily.bodyBold }}
          >
            {openCount}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}
