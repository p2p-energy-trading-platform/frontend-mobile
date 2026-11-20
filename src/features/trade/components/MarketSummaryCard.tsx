import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { priceUnitLabel } from '../constants';
import type { MarketSnapshot } from '../types';
import { formatKwh, formatPrice, getPercentageChange } from '../utils';

function formatUpdated(snapshot: MarketSnapshot) {
  if (!snapshot.updatedAt) return 'Connecting…';

  const time = new Date(snapshot.updatedAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return `${snapshot.status === 'open' ? 'Live' : 'Last update'} · ${time}`;
}

export function MarketSummaryCard({ snapshot }: { snapshot: MarketSnapshot }) {
  const { theme } = useTheme();
  const change = getPercentageChange(snapshot);
  const increasing = change >= 0;
  const changeColor = increasing ? theme.accent : theme.error;

  const stats = [
    ['24h High', formatPrice(snapshot.high24h)],
    ['24h Low', formatPrice(snapshot.low24h)],
    ['24h Volume', formatKwh(snapshot.volume24h)],
  ] as const;

  return (
    <Card>
      <AppText className="text-xs" style={{ color: theme.textTertiary }}>
        Current price
      </AppText>

      <View className="mt-1 flex-row items-baseline gap-2">
        <AppText
          accessibilityLabel={`Current price ${formatPrice(snapshot.currentPrice)} per kilowatt-hour`}
          className="text-3xl"
          style={{ fontFamily: FontFamily.heading }}
        >
          {snapshot.currentPrice.toFixed(3)}
        </AppText>
        <AppText className="text-xs" style={{ color: theme.textTertiary }}>
          {priceUnitLabel}
        </AppText>
      </View>

      <View className="mt-1 flex-row items-center gap-1.5">
        <Icon name={increasing ? 'trending-up' : 'trending-down'} size={14} color={changeColor} />
        <AppText
          className="text-xs"
          style={{ color: changeColor, fontFamily: FontFamily.bodySemibold }}
        >
          {increasing ? '+' : ''}
          {change.toFixed(1)}% · 24h
        </AppText>
        <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
          {formatUpdated(snapshot)}
        </AppText>
      </View>

      <View
        className="mt-4 flex-row justify-between border-t pt-3"
        style={{ borderTopColor: theme.borderSubtle }}
      >
        {stats.map(([label, value]) => (
          <View key={label} className="gap-0.5">
            <AppText className="text-xs" style={{ color: theme.textTertiary }}>
              {label}
            </AppText>
            <AppText className="text-sm" style={{ fontFamily: FontFamily.bodySemibold }}>
              {value}
            </AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}
