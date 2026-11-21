import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { TextField } from '@/shared/components/ui/TextField';
import { TextLink } from '@/shared/components/ui/TextLink';
import { useGoBack } from '@/shared/hooks/use-go-back';

import { AuthButton } from './components/AuthButton';
import { AuthFooter } from './components/AuthFooter';
import { AuthHeader } from './components/AuthHeader';
import { AuthLayout } from './components/AuthLayout';
import { PasswordField } from './components/PasswordField';
import { isValidEmail, isValidSriLankanNicNumber, toIsoDate } from './utils';

export function CreateAccountScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (
      fullName.trim() &&
      isValidEmail(email) &&
      password.length >= 8 &&
      confirmPassword === password
    ) {
      router.push('/verify-email');
    }
  };

  return (
    <AuthLayout
      onBack={goBack}
      footer={
        <AuthFooter
          prompt="Already have an account?"
          actionLabel="Sign in"
          onAction={() => router.replace('/sign-in')}
        />
      }
    >
      <AuthHeader title="Create account" subtitle="Start using GridX in a few steps." />

      <View className="gap-5">
        <TextField
          label="Full name"
          placeholder="Your full name"
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
          textContentType="name"
          error={submitted && !fullName.trim() ? 'Full name is required' : undefined}
        />
        <TextField
          label="Email address"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={submitted && !isValidEmail(email) ? 'Enter a valid email address' : undefined}
        />
        <PasswordField
          label="Password"
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          error={
            submitted && password.length < 8
              ? 'Password must be at least 8 characters'
              : undefined
          }
        />
        <PasswordField
          label="Confirm password"
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={
            submitted && confirmPassword !== password ? 'Passwords do not match' : undefined
          }
        />
      </View>

      <AuthButton title="Create account" onPress={submit} />
    </AuthLayout>
  );
}

export function VerifyEmailScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (/^\d{6}$/.test(code)) {
      router.push('/kyc');
    }
  };

  return (
    <AuthLayout
      onBack={goBack}
      footer={<TextLink label="Resend verification code" onPress={() => setSubmitted(false)} />}
    >
      <AuthHeader title="Verify your email" subtitle="Enter the 6-digit code sent to your email." />

      <TextField
        label="Verification code"
        placeholder="000000"
        value={code}
        onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        autoComplete="one-time-code"
        textContentType="oneTimeCode"
        error={submitted && !/^\d{6}$/.test(code) ? 'Enter a 6-digit code' : undefined}
      />

      <AuthButton title="Verify email" onPress={submit} />
    </AuthLayout>
  );
}

export function KycScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const [fullName, setFullName] = useState('');
  const [nic, setNic] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (fullName.trim() && isValidSriLankanNicNumber(nic) && toIsoDate(dateOfBirth)) {
      router.push('/smart-meter');
    }
  };

  return (
    <AuthLayout onBack={goBack}>
      <AuthHeader title="Identity verification" subtitle="Add the details required for KYC." />

      <View className="gap-5">
        <TextField
          label="Full name"
          placeholder="As shown on your NIC"
          value={fullName}
          onChangeText={setFullName}
          autoComplete="name"
          textContentType="name"
          error={submitted && !fullName.trim() ? 'Full name is required' : undefined}
        />
        <TextField
          label="NIC number"
          placeholder="National identity card number"
          value={nic}
          onChangeText={(value) => setNic(value.trim().toUpperCase())}
          autoCapitalize="characters"
          error={
            submitted && !isValidSriLankanNicNumber(nic)
              ? 'Enter a valid Sri Lankan NIC number'
              : undefined
          }
        />
        <TextField
          label="Date of birth"
          placeholder="DD/MM/YYYY"
          value={dateOfBirth}
          onChangeText={setDateOfBirth}
          keyboardType="number-pad"
          error={
            submitted && !toIsoDate(dateOfBirth)
              ? 'Enter a valid date in DD/MM/YYYY format'
              : undefined
          }
        />
      </View>

      <AuthButton title="Continue" onPress={submit} />
    </AuthLayout>
  );
}

export function SmartMeterScreen() {
  const router = useRouter();
  const goBack = useGoBack();
  const [meterId, setMeterId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    setSubmitted(true);
    if (meterId.trim()) {
      router.replace('/(tabs)');
    }
  };

  return (
    <AuthLayout onBack={goBack}>
      <AuthHeader title="Connect smart meter" subtitle="Enter the meter ID found on your device." />

      <TextField
        label="Meter ID"
        placeholder="Enter meter ID"
        value={meterId}
        onChangeText={setMeterId}
        autoCapitalize="characters"
        error={submitted && !meterId.trim() ? 'Meter ID is required' : undefined}
      />

      <AuthButton title="Connect meter" onPress={submit} />
    </AuthLayout>
  );
}
