import { View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { AppText } from './AppText';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
};

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  const { theme } = useTheme();

  return (
    <View className="gap-1">
      <AppText style={{ fontSize: 24, lineHeight: 30, fontFamily: FontFamily.heading }}>
        {title}
      </AppText>

      {subtitle ? (
        <AppText
          style={{
            color: theme.textPlaceholder,
            fontSize: 13,
            lineHeight: 18,
            fontFamily: FontFamily.body,
          }}
        >
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
