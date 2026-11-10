import type { IconName } from '@/shared/components/ui/Icon';

export type NotificationTone = 'trade' | 'success' | 'warning' | 'info' | 'neutral';

/** Colour of the small dot next to the title. */
export type NotificationPriority = 'high' | 'normal' | 'low';

export type NotificationGroupKey = 'today' | 'yesterday' | 'earlier';

export type NotificationData = {
  id: string;
  group: NotificationGroupKey;
  icon: IconName;
  tone: NotificationTone;
  priority: NotificationPriority;
  title: string;
  time: string;
  body: string;
  /** Link label, e.g. "View trade". Omit for items without an action. */
  action?: string;
  unread: boolean;
};

export type NotificationSection = {
  key: NotificationGroupKey;
  label: string;
  items: NotificationData[];
};
