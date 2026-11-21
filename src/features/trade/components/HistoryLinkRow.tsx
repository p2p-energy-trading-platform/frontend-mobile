import { useRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type HistoryLinkRowProps = {
  label: string;
  /** Number shown in the badge next to the label. */
  count: number;
  /** Small text on the right, e.g. "Sell 0.390 · Buy 0.360". */
  summary?: string;
  onPress?: () => void;
};

/** Tappable row on the Trade screen that opens the history page (Figma: "Open orders row"). */
export function HistoryLinkRow({ label, count, summary, onPress }: HistoryLinkRowProps) {
  const { theme } = useTheme();

  // Ignore repeat taps while the next screen is opening (avoids stacking duplicate screens).
  const lockedRef = useRef(false);

  const handlePress = () => {
    if (lockedRef.current) return;

    lockedRef.current = true;
    onPress?.();

    setTimeout(() => {
      lockedRef.current = false;
    }, 800);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${count}`}
      onPress={handlePress}
      className="h-11 flex-row items-center justify-between rounded-2xl border px-3.5"
      style={{ backgroundColor: theme.surface, borderColor: theme.border }}
    >
      <View className="flex-row items-center gap-2.5">
        <Text className="font-body-semibold text-[13px]" style={{ color: theme.text }}>
          {label}
        </Text>

        <View
          className="h-5 items-center justify-center rounded-full px-[7px]"
          // Figma: text/tertiary at 18% opacity (2E = 18% in hex)
          style={{ backgroundColor: `${theme.textTertiary}2E` }}
        >
          <Text className="font-mono text-[11px]" style={{ color: theme.text }}>
            {count}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {summary ? (
          <Text className="font-body-medium text-[11px]" style={{ color: theme.textTertiary }}>
            {summary}
          </Text>
        ) : null}

        <Icon name="chevron-right" size={16} color={theme.textTertiary} />
      </View>
    </Pressable>
  );
}
