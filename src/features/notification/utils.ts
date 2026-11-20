import { notificationGroups } from './constants';
import type { NotificationData, NotificationSection } from './types';

/** Groups notifications into Today / Yesterday / Earlier, skipping empty groups. */
export function groupNotifications(items: readonly NotificationData[]): NotificationSection[] {
  return notificationGroups
    .map(({ key, label }) => ({
      key,
      label,
      items: items.filter((item) => item.group === key),
    }))
    .filter((section) => section.items.length > 0);
}
