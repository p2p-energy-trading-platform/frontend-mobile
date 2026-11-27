import { View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { TextLink } from '@/shared/components/ui/TextLink';

type PromptLinkProps = {
  prompt: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
};

/** Centred "Didn’t get a code? Resend code" style row. */
export function PromptLink({ prompt, actionLabel, onAction, disabled }: PromptLinkProps) {
  return (
    <View className="flex-row items-center justify-center gap-1">
      <AppText preset="body" tone="textSecondary">
        {prompt}
      </AppText>

      <TextLink label={actionLabel} onPress={onAction} disabled={disabled} />
    </View>
  );
}
