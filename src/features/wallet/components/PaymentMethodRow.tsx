import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Chip } from '@/shared/components/ui/Chip';
import { ConfirmDialog } from '@/shared/components/ui/ConfirmDialog';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { PaymentCard } from '../types';

export function PaymentMethodRow({ card, onRemove }: { card: PaymentCard; onRemove: () => void }) {
  const { theme } = useTheme();
  const brandName = card.brand === 'VISA' ? 'Visa' : 'Mastercard';

  const [confirming, setConfirming] = useState(false);

  return (
    <Card compact>
      <View className="flex-row items-center gap-3">
        <View
          className="h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.surfaceSecondary }}
        >
          <AppText className="font-body-bold text-xs">{card.brand}</AppText>
        </View>

        <View className="min-w-0 flex-1 gap-0.5">
          <View className="flex-row flex-wrap items-center gap-2">
            <AppText className="font-body-semibold text-sm">
              {brandName} •••• {card.number}
            </AppText>
            {card.isDefault ? <Chip label="Default" tone="success" /> : null}
          </View>
          <AppText className="text-xs" style={{ color: theme.textPlaceholder }}>
            Expires {card.expiry} · Deposit only
          </AppText>
        </View>

        {card.isDefault ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${brandName} ending in ${card.number}`}
            onPress={() => setConfirming(true)}
            hitSlop={8}
          >
            <Icon name="close" size={18} color={theme.textTertiary} />
          </Pressable>
        )}
      </View>

      <ConfirmDialog
        visible={confirming}
        title="Remove card?"
        message={`${brandName} ending in ${card.number} will be removed.`}
        confirmLabel="Remove"
        destructive
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          setConfirming(false);
          onRemove();
        }}
      />
    </Card>
  );
}
