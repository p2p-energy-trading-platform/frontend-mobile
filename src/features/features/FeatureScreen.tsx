import { ScrollView, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Card } from '@/shared/components/ui/Card';
import { Icon } from '@/shared/components/ui/Icon';
import { Screen } from '@/shared/components/ui/Screen';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

const modules = [
  {
    title: 'Telemetry',
    description:
      'Track device health, power flow, and live status from one place.',
    icon: 'bar-chart',
  },
  {
    title: 'Scheduling',
    description:
      'Shift load automatically with weather-aware and price-aware policies.',
    icon: 'schedule',
  },
  {
    title: 'Alerts',
    description:
      'Surface exceptions with clear priority so operators can act quickly.',
    icon: 'notifications',
  },
] as const;

const flow = [
  {
    title: 'Collect',
    description: 'Capture live inputs from devices and weather.',
  },
  {
    title: 'Model',
    description: 'Turn raw data into clear operating signals.',
  },
  {
    title: 'Act',
    description: 'Surface the next best action to the user.',
  },
];

export default function FeaturesScreen() {
  const { theme } = useTheme();

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 p-5"
      >
        {/* Header */}

        <View>
          <View
            className="mb-3 self-start flex-row items-center gap-2 rounded-full px-3 py-2"
            style={{
              backgroundColor: theme.surface,
              borderColor: theme.border,
              borderWidth: 1,
            }}
          >
            <Icon
              name="bar-chart"
              size={18}
              color={theme.primary}
            />

            <AppText variant="caption">
              Feature Driven Screens
            </AppText>
          </View>

          <AppText variant="heading">
            Built around the same product flow as web
          </AppText>

          <AppText
            style={{
              color: theme.textSecondary,
              marginTop: 8,
            }}
          >
            Each tab owns a focused domain area and its own UI.
          </AppText>
        </View>

        {/* Modules */}

        <View className="gap-3">
          {modules.map((module) => (
            <Card key={module.title}>
              <View className="gap-3">
                <View
                  className="h-12 w-12 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: theme.surfaceAlt,
                  }}
                >
                  <Icon
                    name={module.icon}
                    size={22}
                    color={theme.primary}
                  />
                </View>

                <View className="gap-1">
                  <AppText variant="title">
                    {module.title}
                  </AppText>

                  <AppText
                    variant="caption"
                    style={{
                      color: theme.textSecondary,
                    }}
                  >
                    {module.description}
                  </AppText>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Flow */}

        <Card>
          <View className="gap-4">
            <AppText variant="title">
              Flow
            </AppText>

            {flow.map((step, index) => (
              <View key={step.title}>
                <View className="flex-row gap-4">
                  <View
                    className="h-10 w-10 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: theme.surfaceAlt,
                    }}
                  >
                    <AppText variant="body">
                      {index + 1}
                    </AppText>
                  </View>

                  <View className="flex-1 gap-1">
                    <AppText variant="body">
                      {step.title}
                    </AppText>

                    <AppText
                      variant="caption"
                      style={{
                        color: theme.textSecondary,
                      }}
                    >
                      {step.description}
                    </AppText>
                  </View>
                </View>

                {index < flow.length - 1 && (
                  <View
                    className="mt-4 h-px"
                    style={{
                      backgroundColor: theme.border,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}