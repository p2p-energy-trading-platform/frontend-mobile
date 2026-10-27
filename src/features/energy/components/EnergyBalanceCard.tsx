import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import type { BalanceSource, IconTone } from '../types';

type EnergyBalanceCardProps = {
  sources: readonly BalanceSource[];
  footer: { label: string; value: string };
};

export function EnergyBalanceCard({ sources, footer }: EnergyBalanceCardProps) {
  const { theme } = useTheme();

  const toneColor: Record<IconTone, string> = {
    warning: theme.feedback.warning.icon,
    info: theme.feedback.info.icon,
    accent: theme.accent,
  };

  return (
    <Card>
      <View className="gap-5">
        <AppText style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
          Energy balance
        </AppText>

        {sources.map((source) => (
          <View key={source.key} className="gap-2.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <View
                  className="h-7 w-7 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: theme.surfaceSecondary }}
                >
                  <Icon name={source.icon} size={14} color={toneColor[source.tone]} />
                </View>

                <AppText
                  style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}
                >
                  {source.label}
                </AppText>
              </View>

              <AppText style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.mono }}>
                {source.total}
              </AppText>
            </View>

            <View
              className="flex-row overflow-hidden rounded"
              style={{ backgroundColor: theme.surfaceSecondary, gap: 2 }}
            >
              {source.segments.map((segment) => (
                <View
                  key={segment.label}
                  style={{
                    flex: segment.value,
                    height: 8,
                    backgroundColor: theme.chart[segment.color],
                  }}
                />
              ))}
            </View>

            <View className="flex-row flex-wrap items-center gap-x-3.5 gap-y-1">
              {source.segments.map((segment) => (
                <View key={segment.label} className="flex-row items-center gap-1.5">
                  <View
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: theme.chart[segment.color] }}
                  />

                  <AppText
                    style={{
                      color: theme.textTertiary,
                      fontSize: 11,
                      lineHeight: 16,
                      fontFamily: FontFamily.body,
                    }}
                  >
                    {segment.label} {segment.value}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />

        <View className="flex-row items-center justify-between">
          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: FontFamily.body,
            }}
          >
            {footer.label}
          </AppText>

          <AppText
            style={{
              color: theme.feedback.success.text,
              fontSize: 14,
              lineHeight: 20,
              fontFamily: FontFamily.mono,
            }}
          >
            {footer.value}
          </AppText>
        </View>
      </View>
    </Card>
  );
}
