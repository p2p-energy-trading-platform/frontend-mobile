import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { useOrderBook } from '../hooks';
import type { OrderBookRow } from '../types';
import { formatPrice } from '../utils';

function BookSide({ label, rows, color }: { label: string; rows: OrderBookRow[]; color: string }) {
  const { theme } = useTheme();

  return (
    <View>
      <AppText className="mb-1 text-xs" style={{ color, fontFamily: FontFamily.bodySemibold }}>
        {label}
      </AppText>

      <View className="flex-row border-b pb-1" style={{ borderBottomColor: theme.borderSubtle }}>
        {['Price (AED)', 'Qty (kWh)', 'Total (AED)'].map((heading, index) => (
          <AppText
            key={heading}
            className={index === 0 ? 'flex-1 text-xs' : 'flex-1 text-right text-xs'}
            style={{ color: theme.textTertiary }}
          >
            {heading}
          </AppText>
        ))}
      </View>

      {rows.map(([price, quantity]) => (
        <View key={price} className="flex-row py-1.5">
          <AppText className="flex-1 text-xs" style={{ color, fontFamily: FontFamily.bodyMedium }}>
            {price.toFixed(3)}
          </AppText>
          <AppText className="flex-1 text-right text-xs" style={{ color: theme.textSecondary }}>
            {quantity}
          </AppText>
          <AppText className="flex-1 text-right text-xs">{(price * quantity).toFixed(2)}</AppText>
        </View>
      ))}
    </View>
  );
}

export function OrderBookCard() {
  const { theme } = useTheme();
  const { asks, bids, spread } = useOrderBook();

  return (
    <Card>
      <View className="mb-3 flex-row items-center justify-between">
        <View>
          <AppText className="text-base" style={{ fontFamily: FontFamily.bodySemibold }}>
            Order Book
          </AppText>
          <AppText className="text-xs" style={{ color: theme.textTertiary }}>
            Live market depth
          </AppText>
        </View>

        <View className="flex-row items-center gap-1.5">
          <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
          <AppText className="text-xs" style={{ color: theme.accent }}>
            Live
          </AppText>
        </View>
      </View>

      <View className="gap-4">
        <BookSide label="Asks" rows={asks} color={theme.error} />
        <BookSide label="Bids" rows={bids} color={theme.accent} />
      </View>

      <View
        className="mt-3 flex-row items-center justify-center gap-2 rounded-xl py-2"
        style={{ backgroundColor: theme.surfaceAlt }}
      >
        <Icon name="activity" size={14} color={theme.accent} />
        <AppText className="text-xs" style={{ color: theme.textSecondary }}>
          Spread:
        </AppText>
        <AppText className="text-xs" style={{ fontFamily: FontFamily.bodySemibold }}>
          {formatPrice(spread)}
        </AppText>
      </View>
    </Card>
  );
}
