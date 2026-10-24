import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type SummaryCardProps = {
  icon: IconName;
  label: string;
  value: string;
};

export function SummaryCard({ icon, label, value }: SummaryCardProps) {
  const { theme } = useTheme();

  return (
    <Card style={{ flex: 1 }}>
      <View className="gap-3">
        <View
          className="h-8 w-8 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.surfaceSecondary }}
        >
          <Icon name={icon} size={18} color={theme.icon} />
        </View>

        <View className="gap-0.5">
          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: FontFamily.body,
            }}
          >
            {label}
          </AppText>

          <AppText
            numberOfLines={1}
            style={{ fontSize: 16, lineHeight: 22, fontFamily: FontFamily.mono }}
          >
            {value}
          </AppText>
        </View>
      </View>
    </Card>
  );
}
