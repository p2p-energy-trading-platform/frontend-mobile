import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { Icon } from '@/shared/components/ui/Icon';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { paymentMethodOptions } from '../constants';
import { usePaymentMethods } from '../hooks';

import { PaymentMethodRow } from './PaymentMethodRow';

type PaymentMethodsProps = {
  onAdd: () => void;
  onLink: () => void;
};

export function PaymentMethods({ onAdd, onLink }: PaymentMethodsProps) {
  const { theme } = useTheme();
  const { tab, setTab, cards, removeCard } = usePaymentMethods();

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText className="font-body-semibold text-base">Payment methods</AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add payment method"
          onPress={onAdd}
          className="h-9 flex-row items-center gap-1.5 rounded-xl px-3"
          style={{ backgroundColor: theme.accent }}
        >
          <Icon name="plus" size={16} color={theme.accentForeground} />
          <AppText className="font-body-semibold text-xs" style={{ color: theme.accentForeground }}>
            Add
          </AppText>
        </Pressable>
      </View>

      <SegmentedControl options={paymentMethodOptions} value={tab} onChange={setTab} size="sm" />

      {tab === 'cards' ? (
        <View className="gap-2.5">
          {cards.map((card) => (
            <PaymentMethodRow
              key={card.number}
              card={card}
              onRemove={() => removeCard(card.number)}
            />
          ))}
        </View>
      ) : (
        <Card compact>
          <View className="flex-row items-center gap-3">
            <View
              className="h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <Icon name="account-balance-wallet" size={20} color={theme.accent} />
            </View>
            <View className="flex-1 gap-0.5">
              <AppText className="font-body-semibold text-sm">Add a bank account</AppText>
              <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
                Needed to withdraw funds
              </AppText>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Link bank account"
              onPress={onLink}
            >
              <Chip label="Link" tone="neutral" />
            </Pressable>
          </View>
        </Card>
      )}
    </View>
  );
}
