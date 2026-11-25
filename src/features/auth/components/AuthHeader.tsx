import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';

type AuthHeaderProps = {
  title: string;
  /** Plain text, or text with highlighted parts. */
  subtitle: ReactNode;
  /** Shown above the title, e.g. an IconBadge. */
  icon?: ReactNode;
  /** Tighter gap between title and subtitle. */
  compact?: boolean;
};

/** Page title + subtitle, with an optional icon above (Figma: Header). */
export function AuthHeader({ title, subtitle, icon, compact }: AuthHeaderProps) {
  return (
    <View className="gap-4">
      {icon}

      <View className={compact ? 'gap-2' : 'gap-3'}>
        <AppText accessibilityRole="header" preset="title">
          {title}
        </AppText>

        <AppText preset="subtitle" tone="textSecondary">
          {subtitle}
        </AppText>
      </View>
    </View>
  );
}
