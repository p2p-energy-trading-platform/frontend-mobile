import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import type { ComponentProps } from 'react';
import { Platform, type ColorValue } from 'react-native';

type HoverEffectProps = {
  color?: ColorValue;
  hoverOpacity?: number;
  activeOpacity?: number;
};

type HapticTabProps = Omit<
  ComponentProps<typeof PlatformPressable>,
  'pressColor' | 'hoverEffect'
> & {
  pressColor?: ColorValue;
  hoverEffect?: HoverEffectProps;
};

export function HapticTab({ pressColor, hoverEffect, ...props }: HapticTabProps) {
  const normalizedHoverEffect = hoverEffect
    ? {
        ...hoverEffect,
        color: typeof hoverEffect.color === 'string' ? hoverEffect.color : undefined,
      }
    : undefined;

  return (
    <PlatformPressable
      {...props}
      pressColor={typeof pressColor === 'string' ? pressColor : undefined}
      hoverEffect={normalizedHoverEffect}
      onPress={(event) => {
        if (Platform.OS === 'ios') {
          Haptics.selectionAsync();
        }

        props.onPress?.(event);
      }}
    />
  );
}
