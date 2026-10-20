import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Button } from '@/shared/components/ui/Button';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { Typography } from '@/shared/design-system/tokens';

import { GoogleButton } from './GoogleButton';

type SplashActionsProps = {
  onSignUpWithEmail?: () => void;
  onContinueWithGoogle?: () => void;
  onSignIn?: () => void;
};

export function SplashActions({
  onSignUpWithEmail,
  onContinueWithGoogle,
  onSignIn,
}: SplashActionsProps) {
  const { theme } = useTheme();

  return (
    <View className="gap-3">
      <Button
        title="Sign up with email"
        variant="accent"
        onPress={onSignUpWithEmail}
        textStyle={{
          fontWeight: Typography.fontWeight.semibold,
        }}
      />

      <GoogleButton onPress={onContinueWithGoogle} />

      <View className="flex-row items-center justify-center gap-1 pt-2">
        <AppText
          variant="caption"
          style={{
            color: theme.textPlaceholder,
          }}
        >
          Already have an account?
        </AppText>

        <Pressable onPress={onSignIn} hitSlop={8}>
          <AppText
            variant="caption"
            style={{
              color: theme.accent,
              fontWeight: Typography.fontWeight.semibold,
            }}
          >
            Sign in
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}
