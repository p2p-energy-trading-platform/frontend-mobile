import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import type { IconTone, Insight } from '../types';

type InsightsSectionProps = {
  insights: readonly Insight[];
  onViewAll?: () => void;
};

export function InsightsSection({ insights, onViewAll }: InsightsSectionProps) {
  const { theme } = useTheme();

  const toneColor: Record<IconTone, string> = {
    warning: theme.feedback.warning.icon,
    info: theme.feedback.info.icon,
    accent: theme.accent,
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText style={{ fontSize: 16, lineHeight: 24, fontFamily: FontFamily.bodySemibold }}>
          Insights
        </AppText>

        <Pressable onPress={onViewAll} hitSlop={8}>
          <AppText
            style={{
              color: theme.accent,
              fontSize: 13,
              lineHeight: 18,
              fontFamily: FontFamily.bodySemibold,
            }}
          >
            View all
          </AppText>
        </Pressable>
      </View>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {insights.map((insight, index) => (
          <View key={insight.key}>
            {index > 0 ? (
              <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />
            ) : null}

            <View className="flex-row items-start gap-3 px-4 py-3.5">
              <View
                className="h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: theme.surfaceSecondary }}
              >
                <Icon name={insight.icon} size={18} color={toneColor[insight.tone]} />
              </View>

              <View className="min-w-0 flex-1 gap-0.5">
                <AppText
                  style={{ fontSize: 14, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}
                >
                  {insight.title}
                </AppText>

                <AppText
                  style={{
                    color: theme.textSecondary,
                    fontSize: 12,
                    lineHeight: 18,
                    fontFamily: FontFamily.body,
                  }}
                >
                  {insight.body}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
