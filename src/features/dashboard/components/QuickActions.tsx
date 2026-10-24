import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type QuickActionsProps = {
  onBuy?: () => void;
  onSell?: () => void;
};

export function QuickActions({ onBuy, onSell }: QuickActionsProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-row gap-3">
      <Pressable
        onPress={onBuy}
        className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] px-4"
        style={{ backgroundColor: theme.accent }}
      >
        <Icon name="south-west" size={18} color={theme.accentForeground} />

        <AppText
          style={{
            color: theme.accentForeground,
            fontSize: 14,
            fontFamily: FontFamily.bodySemibold,
          }}
        >
          Buy energy
        </AppText>
      </Pressable>

      <Pressable
        onPress={onSell}
        className="h-12 flex-1 flex-row items-center justify-center gap-2 rounded-[14px] border px-4"
        style={{ backgroundColor: theme.surface, borderColor: theme.border }}
      >
        <Icon name="north-east" size={18} color={theme.accent} />

        <AppText
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            fontFamily: FontFamily.bodySemibold,
          }}
        >
          Sell surplus
        </AppText>
      </Pressable>
    </View>
  );
}
