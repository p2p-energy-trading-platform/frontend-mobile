import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPress={(event) => {
        if (Platform.OS === 'ios') {
          Haptics.selectionAsync();
        }

        props.onPress?.(event);
      }}
    />
  );
}
