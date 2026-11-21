import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { AuthTopBar } from './AuthTopBar';

type AuthLayoutProps = PropsWithChildren<{
  onBack: () => void;
  /** Pinned to the bottom of the screen when the content is short. */
  footer?: ReactNode;
}>;

// keeps the form readable on tablets and the web preview
const CONTENT = { width: '100%', maxWidth: 440, alignSelf: 'center' } as const;

/** Page shell shared by the auth screens: top bar, scrollable body, bottom footer. */
export function AuthLayout({ onBack, footer, children }: AuthLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <AuthTopBar onBack={onBack} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerClassName="grow"
          contentContainerStyle={CONTENT}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-8 px-6 pt-16">{children}</View>

          <View className="flex-1" />

          <View style={{ paddingBottom: Math.max(insets.bottom, 32) }}>{footer}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
