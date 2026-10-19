import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps } from 'react-native';

export function HapticTab(props: PressableProps) {
  return (
    <Pressable
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
