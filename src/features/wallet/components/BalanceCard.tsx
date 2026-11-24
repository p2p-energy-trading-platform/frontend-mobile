import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { formatAmount } from '@/shared/utils/format';

import { walletBalance, walletStats } from '../constants';

export function BalanceCard() {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="gap-4">
        <AppText className="text-sm" style={{ color: theme.textSecondary }}>
          Available balance
        </AppText>

        <View className="flex-row items-baseline gap-2">
          <AppText className="font-mono text-[38px] leading-[44px]" style={{ color: theme.accent }}>
            {formatAmount(walletBalance.available)}
          </AppText>
          <AppText className="text-base" style={{ color: theme.textPlaceholder }}>
            AED
          </AppText>
        </View>

        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />

        <View className="flex-row justify-between">
          {walletStats.map((stat) => (
            <View key={stat.label} className="flex-1 gap-0.5">
              <AppText className="text-xs" style={{ color: theme.textTertiary }}>
                {stat.label}
              </AppText>
              <AppText
                className="font-mono text-sm"
                style={{ color: stat.highlight ? theme.warning : theme.text }}
              >
                {formatAmount(stat.value)}
              </AppText>
              <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
                {stat.caption}
              </AppText>
            </View>
          ))}
        </View>

        <AppText className="text-xs" style={{ color: theme.textTertiary }}>
          1 GridX credit = AED 1.00
        </AppText>
      </View>
    </Card>
  );
}
