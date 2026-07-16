import { TextInput, TextInputProps } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';

export function Input({ style, ...props }: TextInputProps) {
  const { theme } = useTheme();

  return (
    <TextInput
      className="rounded-xl px-4 py-3 border-1"
      placeholderTextColor={theme.textSecondary}
      style={[
        {
          color: theme.text,
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
      {...props}
    />
  );
}
