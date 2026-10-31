import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

/** Temporary Assets tab content. Replace with the Devices / Automation screens. */
export function AssetsPlaceholder() {
  const { theme } = useTheme();

  return (
    <Card>
      <View className="items-center gap-1 py-6">
        <AppText style={{ fontSize: 14, fontFamily: FontFamily.bodySemibold }}>Assets</AppText>

        <AppText
          style={{ color: theme.textPlaceholder, fontSize: 12, fontFamily: FontFamily.body }}
        >
          Devices and automation coming soon
        </AppText>
      </View>
    </Card>
  );
}
