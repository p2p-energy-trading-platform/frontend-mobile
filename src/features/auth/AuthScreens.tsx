import { useMemo, useState } from 'react';
import { Alert, ActivityIndicator, Modal, Pressable, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/shared/components/ui/AppText';
import { GoogleButton } from '@/features/splash/components/GoogleButton';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Typography } from '@/shared/design-system/tokens';
import { useAppStore } from '@/store/app-store';

import {
  AuthButton,
  AuthHeading,
  AuthLayout,
  BrandMark,
  CheckBox,
  DateField,
  Divider,
  InlineLink,
  OtpInput,
  PasswordField,
  SectionLabel,
  SelectField,
  StepHeader,
  TextField,
} from './components/AuthComponents';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordHint = 'At least 8 characters, including a letter and a number.';
const passwordIsValid = (password: string) =>
  password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

function FieldSpacer() {
  return <View className="h-4" />;
}

function AuthFooter({ children }: { children: React.ReactNode }) {
  return (
    <View className="mt-auto flex-row items-center justify-center gap-1 pt-7">{children}</View>
  );
}

function LinkText({ children, onPress }: { children: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={6}>
      <AppText
        variant="caption"
        style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
      >
        {children}
      </AppText>
    </Pressable>
  );
}

export function SignInScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailError =
    submitted && !emailPattern.test(email.trim()) ? 'Enter a valid email address.' : undefined;
  const passwordError = submitted && !password ? 'Enter your password.' : undefined;

  const signIn = () => {
    setSubmitted(true);
    if (!emailPattern.test(email.trim()) || !password) return;
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  return (
    <AuthLayout>
      <View className="flex-1 gap-8">
        <BrandMark />
        <AuthHeading title="Welcome back" subtitle="Sign in to continue to your GridX account." />

        <View>
          <TextField
            label="Email address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={emailError}
          />
          <FieldSpacer />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />
          <View className="mt-4 flex-row items-center justify-between">
            <CheckBox
              checked={remember}
              onPress={() => setRemember((value) => !value)}
              label="Remember me for 30 days"
            />
            <LinkText
              onPress={() =>
                Alert.alert(
                  'Forgot password?',
                  'Password recovery will be available when account services are connected.',
                )
              }
            >
              Forgot password?
            </LinkText>
          </View>
        </View>

        <View className="gap-5">
          <AuthButton title="Sign in" onPress={signIn} />
          <Divider />
          <GoogleButton
            onPress={() => Alert.alert('Google sign in', 'Google sign in is not connected yet.')}
          />
        </View>

        <AuthFooter>
          <AppText variant="caption" style={{ color: theme.textSecondary }}>
            Don’t have an account?
          </AppText>
          <LinkText onPress={() => router.push('/create-account')}>Create account</LinkText>
        </AuthFooter>
      </View>
    </AuthLayout>
  );
}

export function CreateAccountScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailValid = emailPattern.test(email.trim());
  const passwordValid = passwordIsValid(password);
  const passwordsMatch = password.length > 0 && password === confirmation;
  const formValid = emailValid && passwordValid && passwordsMatch && accepted;
  const passwordError = submitted && !passwordValid ? passwordHint : undefined;
  const confirmationError = submitted && !passwordsMatch ? 'Passwords do not match.' : undefined;

  const continueToVerify = () => {
    setSubmitted(true);
    if (!formValid) return;
    router.push({ pathname: '/verify-email', params: { email: email.trim() } });
  };

  return (
    <AuthLayout>
      <View className="flex-1 gap-6">
        <StepHeader step={1} onBack={() => router.back()} />
        <AuthHeading
          title="Create your account"
          subtitle="Set up your details to get started with GridX."
        />
        <View>
          <TextField
            label="Email address"
            placeholder="name@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            error={submitted && !emailValid ? 'Enter a valid email address.' : undefined}
          />
          <FieldSpacer />
          <PasswordField
            label="Password"
            value={password}
            onChangeText={setPassword}
            helper={passwordHint}
            error={passwordError}
          />
          <FieldSpacer />
          <PasswordField
            label="Confirm password"
            value={confirmation}
            onChangeText={setConfirmation}
            placeholder="Re-enter password"
            error={confirmationError}
          />
        </View>
        <CheckBox checked={accepted} onPress={() => setAccepted((value) => !value)} richTerms />
        <View className="mt-auto gap-4 pt-4">
          <AuthButton title="Continue" disabled={!formValid} onPress={continueToVerify} />
          <View className="flex-row justify-center gap-1">
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Already have an account?
            </AppText>
            <LinkText onPress={() => router.replace('/sign-in')}>Sign in</LinkText>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
}

export function VerifyEmailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : 'your email address';
  const [code, setCode] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const maskedEmail = useMemo(() => {
    const [user = '', domain = ''] = email.split('@');
    if (!domain) return email;
    const visible =
      user.length <= 2
        ? user.slice(0, 1)
        : `${user.slice(0, 1)}${'*'.repeat(Math.min(user.length - 1, 4))}`;
    return `${visible}@${domain}`;
  }, [email]);

  const codeValid = /^\d{6}$/.test(code);

  const verify = () => {
    setSubmitted(true);
    if (!codeValid) return;
    router.push('/kyc');
  };

  return (
    <AuthLayout>
      <View className="flex-1 gap-7">
        <StepHeader step={2} onBack={() => router.back()} />
        <View className="items-center gap-5 pt-2">
          <View
            className="h-16 w-16 items-center justify-center rounded-2xl"
            style={{ backgroundColor: theme.surfaceAlt }}
          >
            <Icon name="mark-email-unread" size={30} color={theme.accent} />
          </View>
          <View className="items-center gap-2">
            <AuthHeading
              centered
              title="Verify your email"
              subtitle={`We sent a 6-digit code to ${maskedEmail}.`}
            />
          </View>
        </View>
        <View className="gap-3">
          <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
            Verification code
          </AppText>
          <OtpInput value={code} onChange={setCode} />
          {submitted && !codeValid ? (
            <AppText variant="caption" style={{ color: theme.error }}>
              Enter all 6 digits.
            </AppText>
          ) : null}
        </View>
        <View className="items-center gap-3">
          <View className="flex-row items-center gap-1">
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Didn’t receive the code?
            </AppText>
            <LinkText
              onPress={() =>
                setResendMessage('A new code is ready to send when email delivery is connected.')
              }
            >
              Resend code
            </LinkText>
          </View>
          {resendMessage ? (
            <AppText variant="caption" style={{ color: theme.textTertiary, textAlign: 'center' }}>
              {resendMessage}
            </AppText>
          ) : null}
          <InlineLink onPress={() => router.replace('/create-account')}>
            Change email address
          </InlineLink>
        </View>
        <View className="mt-auto pt-4">
          <AuthButton title="Verify email" disabled={!codeValid} onPress={verify} />
        </View>
      </View>
    </AuthLayout>
  );
}

type SelectedFile = { name: string; size?: number };

function FileUploadRow({
  title,
  file,
  onPick,
}: {
  title: string;
  file?: SelectedFile;
  onPick: (file: SelectedFile) => void;
}) {
  const { theme } = useTheme();
  const [busy, setBusy] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const acceptFile = (name: string, size?: number) => {
    if (size && size > 5 * 1024 * 1024) {
      Alert.alert('File is too large', 'Choose a JPG, PNG or PDF file up to 5 MB.');
      return;
    }
    onPick({ name, size });
  };

  const chooseDocument = async () => {
    setBusy(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/jpeg', 'image/png', 'application/pdf'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset) acceptFile(asset.name, asset.size);
      }
    } catch {
      Alert.alert('Could not open files', 'Try choosing the file again.');
    } finally {
      setBusy(false);
    }
  };

  const choosePhoto = async () => {
    setBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
      if (!result.canceled) {
        const asset = result.assets[0];
        if (asset)
          acceptFile(
            asset.fileName ?? `${title.toLowerCase().replaceAll(' ', '-')}.jpg`,
            asset.fileSize,
          );
      }
    } catch {
      Alert.alert('Could not open photos', 'Try choosing the image again.');
    } finally {
      setBusy(false);
    }
  };

  const browse = () => setPickerOpen(true);

  return (
    <View
      className="min-h-[68px] flex-row items-center gap-3 rounded-2xl border px-3 py-3"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: theme.surfaceAlt }}
      >
        <Icon
          name={file ? 'check-circle' : 'upload-file'}
          size={21}
          color={file ? theme.success : theme.accent}
        />
      </View>
      <View className="flex-1 gap-1">
        <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
          {title}
        </AppText>
        <AppText
          variant="caption"
          numberOfLines={1}
          style={{ color: file ? theme.success : theme.textTertiary }}
        >
          {file ? file.name : 'JPG, PNG or PDF · Max 5 MB'}
        </AppText>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={browse}
        disabled={busy}
        hitSlop={8}
        className="min-w-14 items-center py-2"
      >
        {busy ? (
          <ActivityIndicator size="small" color={theme.accent} />
        ) : (
          <AppText
            variant="caption"
            style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
          >
            {file ? 'Change' : 'Browse'}
          </AppText>
        )}
      </Pressable>
      <Modal
        transparent
        visible={pickerOpen}
        animationType="slide"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          onPress={() => setPickerOpen(false)}
          style={{ backgroundColor: theme.overlay }}
        >
          <Pressable
            onPress={(event) => event.stopPropagation()}
            className="gap-3 rounded-t-3xl px-5 pb-8 pt-5"
            style={{ backgroundColor: theme.surface }}
          >
            <View
              className="mb-2 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: theme.borderStrong }}
            />
            <AppText variant="title">Upload {title.toLowerCase()}</AppText>
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Choose an image or a PDF up to 5 MB.
            </AppText>
            <Pressable
              onPress={() => {
                setPickerOpen(false);
                void chooseDocument();
              }}
              className="flex-row items-center gap-3 rounded-2xl border p-4"
              style={{ borderColor: theme.border }}
            >
              <Icon name="folder-open" size={21} color={theme.accent} />
              <AppText>Browse files</AppText>
            </Pressable>
            <Pressable
              onPress={() => {
                setPickerOpen(false);
                void choosePhoto();
              }}
              className="flex-row items-center gap-3 rounded-2xl border p-4"
              style={{ borderColor: theme.border }}
            >
              <Icon name="photo-library" size={21} color={theme.accent} />
              <AppText>Photo library</AppText>
            </Pressable>
            <Pressable onPress={() => setPickerOpen(false)} className="items-center py-3">
              <AppText variant="caption" style={{ color: theme.textSecondary }}>
                Cancel
              </AppText>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function validDateOfBirth(value: string) {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const [, dayText, monthText, yearText] = match;
  const day = Number(dayText);
  const month = Number(monthText);
  const year = Number(yearText);
  const date = new Date(year, month - 1, day);
  const validCalendarDate =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return validCalendarDate && date <= cutoff;
}

function emiratesIdMask(value: string) {
  const raw = value.replace(/\D/g, '');
  if (!raw) return '';
  const suffix = raw.startsWith('784') ? raw.slice(3) : raw;
  const digits = `784${suffix}`.slice(0, 15);
  const parts = [
    digits.slice(0, 3),
    digits.slice(3, 7),
    digits.slice(7, 14),
    digits.slice(14, 15),
  ].filter(Boolean);
  return parts.join('-');
}

export function KycScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [emiratesId, setEmiratesId] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [files, setFiles] = useState<Record<string, SelectedFile | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const idValid = /^784-\d{4}-\d{7}-\d$/.test(emiratesId);
  const valid =
    name.trim().length >= 2 &&
    idValid &&
    validDateOfBirth(dateOfBirth) &&
    Boolean(nationality) &&
    Boolean(files['ID front']) &&
    Boolean(files['ID back']) &&
    Boolean(files.Selfie);
  const upload = (title: string) => (file: SelectedFile) =>
    setFiles((current) => ({ ...current, [title]: file }));

  const submit = () => {
    setSubmitted(true);
    if (valid) router.push('/smart-meter');
  };

  return (
    <AuthLayout contentStyle={{ paddingBottom: 30 }}>
      <View className="gap-6">
        <StepHeader step={3} onBack={() => router.back()} />
        <AuthHeading
          title="Verify your identity"
          subtitle="Required by UAE regulations before you can trade or use the wallet. Takes about 2 minutes."
        />
        <TextField
          label="Full legal name"
          placeholder="As shown on your Emirates ID"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          error={submitted && name.trim().length < 2 ? 'Enter your full legal name.' : undefined}
        />
        <TextField
          label="Emirates ID number"
          placeholder="784-YYYY-NNNNNNN-C"
          value={emiratesId}
          onChangeText={(value) => setEmiratesId(emiratesIdMask(value))}
          keyboardType="number-pad"
          error={submitted && !idValid ? 'Enter a valid Emirates ID number.' : undefined}
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <DateField value={dateOfBirth} onChange={setDateOfBirth} />
          </View>
          <View className="flex-1">
            <SelectField
              label="Nationality"
              placeholder="Select nationality"
              value={nationality}
              onSelect={setNationality}
              options={[
                'United Arab Emirates',
                'India',
                'Pakistan',
                'Philippines',
                'United Kingdom',
                'United States',
                'Other',
              ]}
            />
          </View>
        </View>
        {submitted && !validDateOfBirth(dateOfBirth) ? (
          <AppText variant="caption" style={{ color: theme.error }}>
            Enter a valid date of birth (18 or older).
          </AppText>
        ) : null}
        <View className="gap-3">
          <SectionLabel title="Upload your documents" hint="JPG / PNG / PDF · Max 5 MB" />
          <FileUploadRow title="ID front" file={files['ID front']} onPick={upload('ID front')} />
          <FileUploadRow title="ID back" file={files['ID back']} onPick={upload('ID back')} />
          <FileUploadRow title="Selfie" file={files.Selfie} onPick={upload('Selfie')} />
        </View>
        <View className="gap-4 pt-1">
          <AuthButton title="Submit for verification" disabled={!valid} onPress={submit} />
          <Pressable
            accessibilityRole="link"
            onPress={() => router.push('/smart-meter')}
            className="items-center py-1"
          >
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Skip for now, verify later in Settings
            </AppText>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}

function OptionCard({
  title,
  subtitle,
  selected,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  selected: boolean;
  icon: 'bolt' | 'speed';
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-1 flex-row items-center gap-3 rounded-2xl border p-3"
      style={{
        borderColor: selected ? theme.accent : theme.border,
        backgroundColor: selected ? theme.surfaceAlt : theme.surface,
      }}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: selected ? theme.accent : theme.surfaceAlt }}
      >
        <Icon name={icon} size={20} color={selected ? theme.accentForeground : theme.icon} />
      </View>
      <View className="flex-1 gap-1">
        <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
          {title}
        </AppText>
        <AppText
          variant="caption"
          numberOfLines={2}
          style={{ color: theme.textTertiary, fontSize: Typography.fontSize.xs }}
        >
          {subtitle}
        </AppText>
      </View>
      <View
        className="h-5 w-5 items-center justify-center rounded-full border"
        style={{ borderColor: selected ? theme.accent : theme.borderStrong }}
      >
        {selected ? (
          <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: theme.accent }} />
        ) : null}
      </View>
    </Pressable>
  );
}

type TestStatus = 'idle' | 'testing' | 'success' | 'failed';

export function SmartMeterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const setAuthenticated = useAppStore((state) => state.setAuthenticated);
  const [meterType, setMeterType] = useState<'DEWA Advanced' | 'DEWA Standard' | ''>(
    'DEWA Advanced',
  );
  const [serial, setSerial] = useState('');
  const [zone, setZone] = useState('');
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');

  const connectionTest = () => {
    if (!serial.trim()) {
      setTestStatus('failed');
      return;
    }
    setTestStatus('testing');
    setTimeout(() => setTestStatus(/fail|0000/i.test(serial) ? 'failed' : 'success'), 700);
  };

  const valid = Boolean(meterType && serial.trim().length >= 5 && zone && testStatus === 'success');

  const finish = () => {
    if (!valid) return;
    setAuthenticated(true);
    router.replace('/(tabs)');
  };

  const testLabel =
    testStatus === 'success' ? 'Connected' : testStatus === 'failed' ? 'Retry' : 'Test';

  return (
    <AuthLayout contentStyle={{ paddingBottom: 30 }}>
      <View className="gap-6">
        <StepHeader step={4} onBack={() => router.back()} />
        <AuthHeading
          title="Connect your smart meter"
          subtitle="Link your DEWA meter to start tracking and trading your energy."
        />
        <View className="gap-3">
          <SectionLabel title="Choose your meter type" />
          <View className="flex-row gap-3">
            <OptionCard
              title="DEWA Advanced"
              subtitle="Smart meter with two-way data"
              icon="bolt"
              selected={meterType === 'DEWA Advanced'}
              onPress={() => setMeterType('DEWA Advanced')}
            />
            <OptionCard
              title="DEWA Standard"
              subtitle="Standard digital meter"
              icon="speed"
              selected={meterType === 'DEWA Standard'}
              onPress={() => setMeterType('DEWA Standard')}
            />
          </View>
        </View>
        <TextField
          label="Meter serial number"
          placeholder="Enter meter serial number"
          value={serial}
          onChangeText={(value) => {
            setSerial(value);
            setTestStatus('idle');
          }}
          autoCapitalize="characters"
          error={
            serial.length > 0 && serial.trim().length < 5
              ? 'Enter at least 5 characters.'
              : undefined
          }
        />
        <SelectField
          label="Grid zone"
          placeholder="Select your grid zone"
          value={zone}
          onSelect={setZone}
          options={[
            'Dubai Marina',
            'Downtown Dubai',
            'Jumeirah',
            'Al Barsha',
            'Deira',
            'Dubai Silicon Oasis',
            'Arabian Ranches',
          ]}
        />
        <View
          className="flex-row items-center gap-3 rounded-2xl border p-4"
          style={{ borderColor: theme.border, backgroundColor: theme.surface }}
        >
          <View
            className="h-10 w-10 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                testStatus === 'success'
                  ? theme.feedback.success.background
                  : testStatus === 'failed'
                    ? theme.feedback.error.background
                    : theme.surfaceAlt,
            }}
          >
            <Icon
              name={
                testStatus === 'success'
                  ? 'check-circle'
                  : testStatus === 'failed'
                    ? 'error-outline'
                    : 'sensors'
              }
              size={22}
              color={
                testStatus === 'success'
                  ? theme.success
                  : testStatus === 'failed'
                    ? theme.error
                    : theme.accent
              }
            />
          </View>
          <View className="flex-1 gap-1">
            <AppText variant="caption" style={{ fontWeight: Typography.fontWeight.semibold }}>
              Connection test
            </AppText>
            <AppText
              variant="caption"
              style={{
                color:
                  testStatus === 'success'
                    ? theme.success
                    : testStatus === 'failed'
                      ? theme.error
                      : theme.textTertiary,
              }}
            >
              {testStatus === 'success'
                ? 'Your meter is connected.'
                : testStatus === 'failed'
                  ? 'Connection failed. Check the serial number.'
                  : 'Make sure your meter is powered on.'}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: testStatus === 'testing' }}
            disabled={testStatus === 'testing'}
            onPress={connectionTest}
            className="min-w-14 items-center rounded-xl border px-3 py-2"
            style={{ borderColor: theme.border }}
          >
            {testStatus === 'testing' ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <AppText
                variant="caption"
                style={{ color: theme.accent, fontWeight: Typography.fontWeight.semibold }}
              >
                {testLabel}
              </AppText>
            )}
          </Pressable>
        </View>
        <View className="gap-4 pt-1">
          <AuthButton title="Save and enter GridX" disabled={!valid} onPress={finish} />
          <Pressable
            accessibilityRole="link"
            onPress={() => {
              setAuthenticated(true);
              router.replace('/(tabs)');
            }}
            className="items-center py-1"
          >
            <AppText variant="caption" style={{ color: theme.textSecondary }}>
              Skip for now, connect meter later in Settings
            </AppText>
          </Pressable>
        </View>
      </View>
    </AuthLayout>
  );
}
