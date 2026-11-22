import { Pressable } from 'react-native';

import { AppText } from './AppText';

const PRESETS = {
  xs: 'captionSemibold',
  sm: 'label',
  md: 'bodySemibold',
} as const;

type TextLinkProps = {
  label: string;
  onPress: () => void;
  size?: keyof typeof PRESETS;
};

/** Accent coloured, semibold inline link. */
export function TextLink({ label, onPress, size = 'md' }: TextLinkProps) {
  return (
    <Pressable accessibilityRole="link" hitSlop={8} onPress={onPress}>
      <AppText preset={PRESETS[size]} tone="accent">
        {label}
      </AppText>
    </Pressable>
  );
}
