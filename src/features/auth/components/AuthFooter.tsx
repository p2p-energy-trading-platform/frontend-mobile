import { View } from 'react-native';

import { PromptLink } from './PromptLink';

type AuthFooterProps = {
  prompt: string;
  actionLabel: string;
  onAction: () => void;
};

/** "Don’t have an account? Create account" row pinned to the bottom (Figma: Footer). */
export function AuthFooter({ prompt, actionLabel, onAction }: AuthFooterProps) {
  return (
    <View className="px-6 pt-2">
      <PromptLink prompt={prompt} actionLabel={actionLabel} onAction={onAction} />
    </View>
  );
}
