import { Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { TradeSide } from '../types';

type SidePillProps = {
  side: TradeSide;
};

/** Small "Sell" / "Buy" pill with a direction arrow. */
export function SidePill({ side }: SidePillProps) {
  const { theme } = useTheme();

  const isSell = side === 'sell';

  const colors = isSell
    ? { background: theme.trade.sellBackground, text: theme.feedback.success.text }
    : { background: theme.trade.buyBackground, text: theme.feedback.info.text };

  return (
    <View
      className="flex-row items-center gap-0.5 rounded-full px-2 py-0.5"
      style={{ backgroundColor: colors.background }}
    >
      <Icon name={isSell ? 'north-east' : 'south-west'} size={9} color={colors.text} />

      <Text className="font-body-bold text-[10px] leading-[15px]" style={{ color: colors.text }}>
        {isSell ? 'Sell' : 'Buy'}
      </Text>
    </View>
  );
}
