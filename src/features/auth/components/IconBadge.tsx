import { View } from 'react-native';

import { Icon, type IconName } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type IconBadgeProps = {
  icon: IconName;
};

/** 44px rounded square with a tinted icon, shown above a screen title (Figma: Mail Icon). */
export function IconBadge({ icon }: IconBadgeProps) {
  const { theme } = useTheme();
  const color = theme.feedback.info.icon;

  return (
    <View
      className="h-11 w-11 items-center justify-center rounded-2xl"
      // Figma: info colour at 8% fill and 20% border (14 / 33 are those opacities in hex)
      style={{ backgroundColor: `${color}14`, borderColor: `${color}33`, borderWidth: 1.3 }}
    >
      <Icon name={icon} size={20} color={color} />
    </View>
  );
}
