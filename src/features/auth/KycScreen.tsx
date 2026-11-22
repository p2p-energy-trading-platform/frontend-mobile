import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { SelectField } from '@/shared/components/ui/SelectField';
import { TextField } from '@/shared/components/ui/TextField';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { StepIndicator } from './components/StepIndicator';
import { UploadField } from './components/UploadField';
import { AUTH_TOTAL_STEPS, KYC_DOCUMENTS, NATIONALITY_OPTIONS, kycContent } from './constants';
import { useKyc } from './hooks';

export default function KycScreen() {
  const goBack = useGoBack();
  const form = useKyc();

  return (
    <AuthLayout
      spacing="tight"
      onBack={goBack}
      topBarRight={<StepIndicator step={3} total={AUTH_TOTAL_STEPS} />}
      footer={
        <View className="items-center px-6 pt-2">
          <Pressable accessibilityRole="link" hitSlop={8} onPress={form.skip}>
            <AppText preset="bodyMedium" tone="textSecondary">
              {kycContent.skip}
            </AppText>
          </Pressable>
        </View>
      }
    >
      <AuthHeader compact title={kycContent.title} subtitle={kycContent.subtitle} />

      <View className="gap-4">
        <TextField
          label={kycContent.fullNameLabel}
          placeholder={kycContent.fullNamePlaceholder}
          value={form.fullName}
          onChangeText={form.setFullName}
          onBlur={() => form.touch('fullName')}
          autoComplete="name"
          textContentType="name"
          error={form.errors.fullName}
        />

        <TextField
          label={kycContent.nicLabel}
          placeholder={kycContent.nicPlaceholder}
          value={form.nic}
          onChangeText={form.setNic}
          onBlur={() => form.touch('nic')}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={12}
          error={form.errors.nic}
        />

        <View className="flex-row items-start gap-3">
          <View className="flex-1">
            <TextField
              label={kycContent.dateOfBirthLabel}
              placeholder={kycContent.dateOfBirthPlaceholder}
              value={form.dateOfBirth}
              onChangeText={form.setDateOfBirth}
              onBlur={() => form.touch('dateOfBirth')}
              keyboardType="number-pad"
              maxLength={10}
              error={form.errors.dateOfBirth}
            />
          </View>

          <View className="flex-1">
            <SelectField
              label={kycContent.nationalityLabel}
              placeholder={kycContent.nationalityPlaceholder}
              options={NATIONALITY_OPTIONS}
              value={form.nationality}
              onChange={form.setNationality}
            />
          </View>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <AppText preset="label" tone="textSecondary">
            {kycContent.documentsLabel}
          </AppText>
          <AppText preset="caption" tone="textPlaceholder">
            {kycContent.documentsHint}
          </AppText>
        </View>

        {KYC_DOCUMENTS.map((item) => (
          <UploadField
            key={item.key}
            title={item.title}
            description={item.description}
            document={form.documents[item.key]}
            error={form.documentErrors[item.key]}
            onBrowse={() => void form.browse(item.key)}
          />
        ))}
      </View>

      <AuthButton title={kycContent.submit} disabled={!form.canSubmit} onPress={form.submit} />
    </AuthLayout>
  );
}
