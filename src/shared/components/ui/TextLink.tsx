import { Pressable, Text } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

const SIZES = {
  xs: { fontSize: 12, lineHeight: 16 },
  sm: { fontSize: 13, lineHeight: 18 },
  md: { fontSize: 14, lineHeight: 20 },
} as const;

type TextLinkProps = {
  label: string;
  onPress: () => void;
  size?: keyof typeof SIZES;
};

/** Accent coloured, semibold inline link. */
export function TextLink({ label, onPress, size = 'md' }: TextLinkProps) {
  const { theme } = useTheme();

  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      <Text style={[SIZES[size], { fontFamily: FontFamily.bodySemibold, color: theme.accent }]}>
        {label}
      </Text>
    </Pressable>
  );
}
