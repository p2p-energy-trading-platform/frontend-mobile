import { Alert, Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { ConnectionTestCard } from './components/ConnectionTestcard';
import { MeterTypeOption } from './components/MeterTypeOption';
import { StepIndicator } from './components/StepIndicator';
import { AUTH_TOTAL_STEPS, GRID_ZONE_OPTIONS, METER_TYPES, smartMeterContent } from './constants';
import { useSmartMeter } from './hooks';

export default function SmartMeterScreen() {
  const goBack = useGoBack();
  const form = useSmartMeter();

  const handleTest = () => Alert.alert(smartMeterContent.testTitle, smartMeterContent.testNotice);

  return (
    <AuthLayout
      spacing="tight"
      onBack={goBack}
      topBarRight={<StepIndicator step={4} total={AUTH_TOTAL_STEPS} />}
      footer={
        <View className="items-center px-6 pt-2">
          <Pressable accessibilityRole="link" hitSlop={8} onPress={form.skip}>
            <AppText preset="bodyMedium" tone="textSecondary">
              {smartMeterContent.skip}
            </AppText>
          </Pressable>
        </View>
      }
    >
      <AuthHeader compact title={smartMeterContent.title} subtitle={smartMeterContent.subtitle} />

      <View className="gap-2">
        <AppText preset="label" tone="textSecondary">
          {smartMeterContent.meterTypeLabel}
        </AppText>

        <View accessibilityRole="radiogroup" className="flex-row gap-3">
          {METER_TYPES.map((item) => (
            <MeterTypeOption
              key={item.value}
              title={item.title}
              description={item.description}
              icon={item.icon}
              selected={form.meterType === item.value}
              onPress={() => form.setMeterType(item.value)}
            />
          ))}
        </View>
      </View>

      <View className="gap-4">
        <TextField
          label={smartMeterContent.serialLabel}
          placeholder={smartMeterContent.serialPlaceholder}
          helper={smartMeterContent.serialHint}
          value={form.serial}
          onChangeText={form.setSerial}
          onBlur={form.touchSerial}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={30}
          error={form.serialError}
        />

        <SelectField
          label={smartMeterContent.zoneLabel}
          placeholder={smartMeterContent.zonePlaceholder}
          options={GRID_ZONE_OPTIONS}
          value={form.zone}
          onChange={form.setZone}
        />
      </View>

      <ConnectionTestCard onTest={handleTest} />

      <AuthButton
        title={smartMeterContent.submit}
        disabled={!form.canSubmit || form.entering}
        onPress={form.submit}
      />
    </AuthLayout>
  );
}
