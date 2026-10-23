import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type ColorValue, type PressableProps } from 'react-native';

type HoverEffectProps = {
  color?: ColorValue;
  hoverOpacity?: number;
  activeOpacity?: number;
};

type HapticTabProps = Omit<PressableProps, 'onPress' | 'style'> & {
  onPress?: PressableProps['onPress'];
  pressColor?: ColorValue;
  hoverEffect?: HoverEffectProps;
};

export function HapticTab({
  pressColor,
  hoverEffect: _hoverEffect,
  onPress,
  ...props
}: HapticTabProps) {
  return (
    <Pressable
      {...props}
      android_ripple={typeof pressColor === 'string' ? { color: pressColor } : undefined}
      onPress={(event) => {
        if (Platform.OS === 'ios') {
          Haptics.selectionAsync();
        }

        onPress?.(event);
      }}
    />
  );
}
