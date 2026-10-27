import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  BatteryCharging,
  Bell,
  Bolt,
  CalendarClock,
  Check,
  ChevronDown,
  CircleAlert,
  CircleCheck,
  Clock3,
  Eye,
  EyeOff,
  FileUp,
  FolderOpen,
  Gauge,
  HelpCircle,
  House,
  Images,
  LayoutGrid,
  MailOpen,
  Radio,
  RefreshCw,
  Settings,
  TrendingUp,
  User,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';

const icons = {
  'account-balance-wallet': Wallet,
  apps: LayoutGrid,
  'arrow-back': ArrowLeft,
  'bar-chart': BarChart3,
  'battery-charging-full': BatteryCharging,
  bell: Bell,
  bolt: Bolt,
  check: Check,
  'check-circle': CircleCheck,
  'clock-3': Clock3,
  'error-outline': CircleAlert,
  'folder-open': FolderOpen,
  'help-outline': HelpCircle,
  home: House,
  'keyboard-arrow-down': ChevronDown,
  'mark-email-unread': MailOpen,
  notifications: Bell,
  'notifications-none': Bell,
  person: User,
  'photo-library': Images,
  schedule: CalendarClock,
  sensors: Radio,
  settings: Settings,
  'south-west': ArrowDownLeft,
  speed: Gauge,
  sync: RefreshCw,
  'trending-up': TrendingUp,
  'upload-file': FileUp,
  visibility: Eye,
  'visibility-off': EyeOff,
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
