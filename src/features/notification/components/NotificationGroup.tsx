import { Text, View } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { NotificationData, NotificationSection } from '../types';

import { NotificationItem } from './NotificationItem';

type NotificationGroupProps = {
  section: NotificationSection;
  onPressItem?: (item: NotificationData) => void;
  onPressAction?: (item: NotificationData) => void;
};

/** Group label row ("TODAY") + its notification rows. */
export function NotificationGroup({ section, onPressItem, onPressAction }: NotificationGroupProps) {
  const { theme } = useTheme();

  return (
    <View>
      <View
        className="border-b px-5 py-2.5"
        style={{ backgroundColor: theme.surfaceAlt, borderBottomColor: theme.borderSubtle }}
      >
        <Text
          className="font-body-bold text-[10px] uppercase leading-[15px] tracking-[1px]"
          style={{ color: theme.textDisabled }}
        >
          {section.label}
        </Text>
      </View>

      {section.items.map((item, index) => (
        <NotificationItem
          key={item.id}
          item={item}
          isLast={index === section.items.length - 1}
          onPress={onPressItem}
          onPressAction={onPressAction}
        />
      ))}
    </View>
  );
}
