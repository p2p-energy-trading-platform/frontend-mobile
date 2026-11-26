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
  /** Greys the link out and blocks taps. */
  disabled?: boolean;
};

/** Accent coloured, semibold inline link. */
export function TextLink({ label, onPress, size = 'md', disabled = false }: TextLinkProps) {
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
    >
      <AppText preset={PRESETS[size]} tone={disabled ? 'textPlaceholder' : 'accent'}>
        {label}
      </AppText>
    </Pressable>
  );
}
