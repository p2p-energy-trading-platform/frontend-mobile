import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type Stat = { label: string; value: string };

type SolarGenerationCardProps = {
  title: string;
  badge: string;
  value: string;
  unit: string;
  stats: readonly Stat[];
};

export function SolarGenerationCard({
  title,
  badge,
  value,
  unit,
  stats,
}: SolarGenerationCardProps) {
  const { theme } = useTheme();

  return (
    <Card style={{ padding: 20 }}>
      <View className="gap-5">
        <View className="flex-row items-center justify-between">
          <AppText
            style={{
              color: theme.textSecondary,
              fontSize: 13,
              lineHeight: 18,
              fontFamily: FontFamily.bodyMedium,
            }}
          >
            {title}
          </AppText>

          <Chip label={badge} tone="success" semibold />
        </View>

        <View className="flex-row items-end gap-1.5 pb-1">
          <AppText
            style={{
              color: theme.feedback.warning.icon,
              fontSize: 38,
              lineHeight: 48,
              fontFamily: FontFamily.mono,
            }}
          >
            {value}
          </AppText>

          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 18,
              lineHeight: 26,
              fontFamily: FontFamily.bodyMedium,
            }}
          >
            {unit}
          </AppText>
        </View>

        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />

        <View className="flex-row gap-2">
          {stats.map((stat) => (
            <View key={stat.label} className="flex-1 gap-0.5">
              <AppText
                style={{
                  color: theme.textTertiary,
                  fontSize: 11,
                  lineHeight: 16,
                  fontFamily: FontFamily.body,
                }}
              >
                {stat.label}
              </AppText>

              <AppText
                numberOfLines={1}
                style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.mono }}
              >
                {stat.value}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
