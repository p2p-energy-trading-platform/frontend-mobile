import { MaterialIcons } from '@expo/vector-icons';

type IconProps = {
  name: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string;
};

export function Icon({
  name,
  size = 24,
  color,
}: IconProps) {
  return (
    <MaterialIcons
      name={name}
      size={size}
      color={color}
    />
  );
}