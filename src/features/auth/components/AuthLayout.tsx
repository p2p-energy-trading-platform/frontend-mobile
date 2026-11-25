import type { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Spacing } from '@/shared/design-system/tokens';

import { AuthTopBar } from './AuthTopBar';

/** Space above and between the blocks of the body, from roomiest to tightest. */
const SPACING = {
  loose: 'gap-8 px-6 pt-16',
  normal: 'gap-6 px-6 pt-8',
  tight: 'gap-5 px-6 pt-6',
} as const;

type AuthLayoutProps = PropsWithChildren<{
  onBack: () => void;
  /** Right side of the top bar: the logo mark or the step indicator. */
  topBarRight?: ReactNode;
  /** Pinned to the bottom of the screen when the content is short. */
  footer?: ReactNode;
  spacing?: keyof typeof SPACING;
}>;

// keeps the form readable on tablets and the web preview
const CONTENT_MAX_WIDTH = 440;
const CONTENT = { width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center' } as const;

/** Page shell shared by the auth screens: top bar, scrollable body, bottom footer. */
export function AuthLayout({
  onBack,
  topBarRight,
  footer,
  spacing = 'loose',
  children,
}: AuthLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: theme.background }}>
      <AuthTopBar onBack={onBack} right={topBarRight} />

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
          <View className={SPACING[spacing]}>{children}</View>

          <View className="flex-1" />

          <View style={{ paddingBottom: Math.max(insets.bottom, Spacing[8]) }}>{footer}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
