import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Chip } from '@/shared/components/ui/Chip';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { formatDateTime, getGreeting } from '../utils';

type GreetingHeaderProps = {
  name: string;
  property: string;
  meterStatus: string;
};

export function GreetingHeader({ name, property, meterStatus }: GreetingHeaderProps) {
  const { theme } = useTheme();
  const now = new Date();

  return (
    <View className="gap-2.5">
      <View className="gap-1">
        <AppText style={{ fontSize: 24, lineHeight: 30, fontFamily: FontFamily.heading }}>
          {getGreeting(now)}, {name}
        </AppText>

        <AppText
          style={{
            color: theme.textPlaceholder,
            fontSize: 13,
            lineHeight: 18,
            fontFamily: FontFamily.body,
          }}
        >
          {formatDateTime(now)}
        </AppText>
      </View>

      <View className="flex-row gap-2">
        <Chip label={property} />
        <Chip label={meterStatus} tone="success" dot />
      </View>
    </View>
  );
}
