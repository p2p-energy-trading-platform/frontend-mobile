import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Battery,
  BatteryCharging,
  Bell,
  Bolt,
  CalendarClock,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  Droplets,
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
  Plug,
  Plus,
  Radio,
  RefreshCw,
  Settings,
  Sun,
  TrendingUp,
  User,
  Wallet,
  Wind,
  type LucideIcon,
} from 'lucide-react-native';
import type { ColorValue } from 'react-native';

const icons = {
  'account-balance-wallet': Wallet,
  apps: LayoutGrid,
  'arrow-back': ArrowLeft,
  'bar-chart': BarChart3,
  battery: Battery,
  'battery-charging-full': BatteryCharging,
  bell: Bell,
  bolt: Bolt,
  check: Check,
  car: Car,
  'check-circle': CircleCheck,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'clock-3': Clock3,
  droplets: Droplets,
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
  plus: Plus,
  plug: Plug,
  schedule: CalendarClock,
  sensors: Radio,
  settings: Settings,
  'south-west': ArrowDownLeft,
  speed: Gauge,
  sun: Sun,
  sync: RefreshCw,
  'trending-up': TrendingUp,
  'upload-file': FileUp,
  visibility: Eye,
  'visibility-off': EyeOff,
  wind: Wind,
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
