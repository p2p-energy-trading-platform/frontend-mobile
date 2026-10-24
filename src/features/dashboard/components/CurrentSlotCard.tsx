import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

type CurrentSlotCardProps = {
  label: string;
  time: string;
  remaining: string;
  price: string;
  unit: string;
};

export function CurrentSlotCard({ label, time, remaining, price, unit }: CurrentSlotCardProps) {
  const { theme } = useTheme();

  const caption = {
    color: theme.textPlaceholder,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: FontFamily.body,
  } as const;

  return (
    <Card style={{ overflow: 'hidden', height: 100, justifyContent: 'center' }}>
      {/* 6% accent tint, same as the Figma "Accent tint" layer */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: theme.accent,
          opacity: 0.06,
        }}
      />

      <View className="flex-row items-center justify-between">
        <View className="gap-0.5">
          <AppText style={caption}>{label}</AppText>

          <AppText style={{ fontSize: 15, lineHeight: 22, fontFamily: FontFamily.bodySemibold }}>
            {time}
          </AppText>

          <AppText style={caption}>{remaining}</AppText>
        </View>

        <View className="items-end">
          <AppText
            style={{
              color: theme.accent,
              fontSize: 22,
              lineHeight: 28,
              fontFamily: FontFamily.heading,
            }}
          >
            {price}
          </AppText>

          <AppText style={caption}>{unit}</AppText>
        </View>
      </View>
    </Card>
  );
}
