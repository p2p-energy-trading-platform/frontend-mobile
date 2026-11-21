import { useState } from 'react';
import { Pressable } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { TextField, type TextFieldProps } from '@/shared/components/ui/TextField';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'rightAdornment'>;

/** TextField with a show / hide toggle (Figma: Field / Password). */
export function PasswordField(props: PasswordFieldProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <TextField
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="password"
      textContentType="password"
      {...props}
      secureTextEntry={!visible}
      rightAdornment={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={visible ? 'Hide password' : 'Show password'}
          hitSlop={10}
          onPress={() => setVisible((value) => !value)}
          className="h-10 w-10 items-center justify-center"
        >
          <Icon
            name={visible ? 'visibility-off' : 'visibility'}
            size={16}
            color={theme.textPlaceholder}
          />
        </Pressable>
      }
    />
  );
}
