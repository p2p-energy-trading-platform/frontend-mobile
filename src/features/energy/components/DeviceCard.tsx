import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import type { Device } from '../types';

type DeviceCardProps = {
  device: Device;
};

function StatusChip({ status }: { status: Device['status'] }) {
  const { theme } = useTheme();

  const online = status === 'online';

  const colors = online
    ? {
        background: theme.feedback.success.background,
        border: theme.feedback.success.border,
        text: theme.feedback.success.text,
      }
    : {
        background: theme.surfaceSecondary,
        border: theme.border,
        text: theme.textTertiary,
      };

  return (
    <View
      className="flex-row items-center gap-1.5 rounded-full border px-2.5 py-1"
      style={{ backgroundColor: colors.background, borderColor: colors.border }}
    >
      <View
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: online ? colors.text : theme.textPlaceholder }}
      />

      <AppText
        style={{
          color: colors.text,
          fontSize: 12,
          lineHeight: 16,
          fontFamily: FontFamily.bodyMedium,
        }}
      >
        {online ? 'Online' : 'Idle'}
      </AppText>
    </View>
  );
}

export function DeviceCard({ device }: DeviceCardProps) {
  const { theme } = useTheme();

  const toneColor = {
    warning: theme.feedback.warning.icon,
    accent: theme.accent,
    info: theme.feedback.info.icon,
    purple: theme.chart[3],
  }[device.tone];

  const healthy = device.health === 'good';
  const controllable = device.control === 'controllable';

  return (
    <Card>
      <View className="gap-3.5">
        {/* Head */}
        <View className="flex-row items-center gap-3">
          <View
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: theme.surfaceSecondary }}
          >
            <Icon name={device.icon} size={20} color={toneColor} />
          </View>

          <View className="flex-1 gap-0.5">
            <AppText
              numberOfLines={1}
              style={{ fontSize: 15, lineHeight: 20, fontFamily: FontFamily.bodySemibold }}
            >
              {device.name}
            </AppText>

            <AppText
              numberOfLines={1}
              style={{
                color: theme.textTertiary,
                fontSize: 12,
                lineHeight: 16,
                fontFamily: FontFamily.body,
              }}
            >
              {device.model}
            </AppText>
          </View>

          <StatusChip status={device.status} />
        </View>

        {/* Value row */}
        <View className="flex-row items-end gap-1.5">
          <AppText
            style={{
              color: toneColor,
              fontSize: 26,
              lineHeight: 32,
              fontFamily: FontFamily.mono,
            }}
          >
            {device.value}
          </AppText>

          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 13,
              lineHeight: 20,
              fontFamily: FontFamily.bodyMedium,
            }}
          >
            {device.unit}
          </AppText>

          <AppText
            style={{
              color: theme.textPlaceholder,
              fontSize: 12,
              lineHeight: 20,
              fontFamily: FontFamily.body,
            }}
          >
            {device.activity}
          </AppText>
        </View>

        {/* State of charge */}
        {device.stateOfCharge !== undefined ? (
          <View className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <AppText
                style={{
                  color: theme.textPlaceholder,
                  fontSize: 12,
                  lineHeight: 16,
                  fontFamily: FontFamily.body,
                }}
              >
                State of charge
              </AppText>

              <AppText style={{ fontSize: 12, lineHeight: 16, fontFamily: FontFamily.mono }}>
                {device.stateOfCharge}%
              </AppText>
            </View>

            <View
              className="overflow-hidden rounded-[3px]"
              style={{ backgroundColor: theme.surfaceSecondary }}
            >
              <View
                className="rounded-[3px]"
                style={{
                  height: 6,
                  width: `${Math.min(100, Math.max(0, device.stateOfCharge))}%`,
                  backgroundColor: theme.accent,
                }}
              />
            </View>
          </View>
        ) : null}

        <View className="h-px" style={{ backgroundColor: theme.borderSubtle }} />

        {/* Footer */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <View
              className="h-1.5 w-1.5 rounded-full"
              style={{
                backgroundColor: healthy ? theme.feedback.success.icon : theme.feedback.warning.icon,
              }}
            />

            <AppText
              style={{
                color: theme.textSecondary,
                fontSize: 12,
                lineHeight: 16,
                fontFamily: FontFamily.bodyMedium,
              }}
            >
              {healthy ? 'Good' : 'Degraded'}
            </AppText>

            <AppText
              style={{
                color: theme.textTertiary,
                fontSize: 12,
                lineHeight: 16,
                fontFamily: FontFamily.body,
              }}
            >
              · {device.lastSeen}
            </AppText>
          </View>

          <AppText
            style={{
              color: controllable ? theme.feedback.success.text : theme.feedback.warning.text,
              fontSize: 12,
              lineHeight: 16,
              fontFamily: FontFamily.bodySemibold,
            }}
          >
            {controllable ? 'Controllable' : 'Monitoring only'}
          </AppText>
        </View>
      </View>
    </Card>
  );
}
