import { MaterialIcons } from '@expo/vector-icons';
import { ColorValue } from 'react-native';

type IconProps = {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: ColorValue | string;
};

export function Icon({ name, size = 24, color }: IconProps) {
  return <MaterialIcons name={name} size={size} color={color} />;
}
