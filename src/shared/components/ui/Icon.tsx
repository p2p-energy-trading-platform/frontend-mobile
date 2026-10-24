import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  BatteryCharging,
  Bell,
  Bolt,
  CalendarClock,
  Clock3,
  HelpCircle,
  House,
  LayoutGrid,
  RefreshCw,
  Settings,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';

const icons = {
  'account-balance-wallet': Wallet,
  apps: LayoutGrid,
  'bar-chart': BarChart3,
  'battery-charging-full': BatteryCharging,
  bell: Bell,
  bolt: Bolt,
  'clock-3': Clock3,
  'help-outline': HelpCircle,
  home: House,
  notifications: Bell,
  'notifications-none': Bell,
  schedule: CalendarClock,
  settings: Settings,
  'south-west': ArrowDownLeft,
  sync: RefreshCw,
  'trending-up': TrendingUp,
  'north-east': ArrowUpRight,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue | string;
};

export function Icon({ name, size = 24, color }: IconProps) {
  const IconComponent = icons[name];

  return <IconComponent size={size} color={color as string | undefined} />;
}
