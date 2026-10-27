import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import type { UsageCategory } from '../types';

type UsageByCategoryCardProps = {
  total: string;
  categories: readonly UsageCategory[];
};

export function UsageByCategoryCard({ total, categories }: UsageByCategoryCardProps) {
  const { theme } = useTheme();

  const max = Math.max(...categories.map((c) => c.value));
  const colorOf = (c: UsageCategory) =>
    c.color === 'muted' ? theme.textPlaceholder : theme.chart[c.color];

  return (
    <Card>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <AppText style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
            Usage by category
          </AppText>

          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: FontFamily.body,
            }}
          >
            {total}
          </AppText>
        </View>

        {categories.map((category) => (
          <View key={category.key} className="gap-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colorOf(category) }}
                />

                <AppText
                  style={{
                    color: theme.textSecondary,
                    fontSize: 13,
                    lineHeight: 18,
                    fontFamily: FontFamily.bodyMedium,
                  }}
                >
                  {category.label}
                </AppText>
              </View>

              <AppText style={{ fontSize: 13, lineHeight: 18, fontFamily: FontFamily.mono }}>
                {category.value.toFixed(1)} kWh
              </AppText>
            </View>

            <View
              className="overflow-hidden rounded-[3px]"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <View
                className="rounded-[3px]"
                style={{
                  height: 6,
                  width: `${(category.value / max) * 100}%`,
                  backgroundColor: colorOf(category),
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
