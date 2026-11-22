import { Text, View } from 'react-native';

import { Checkbox } from '@/shared/components/ui/Checkbox';
import { FieldMessage } from '@/shared/components/ui/FieldMessage';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { signUpContent } from '../constants';

type TermsCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onTermsPress: () => void;
  onPrivacyPress: () => void;
  error?: string;
};

/** Checkbox with "Terms of Service" and "Privacy Policy" links (Figma: Terms). */
export function TermsCheckbox({
  checked,
  onChange,
  onTermsPress,
  onPrivacyPress,
  error,
}: TermsCheckboxProps) {
  const { theme } = useTheme();

  const linkStyle = { fontFamily: FontFamily.bodySemibold, color: theme.accent };

  return (
    <View className="gap-2">
      <Checkbox checked={checked} onChange={onChange} label={signUpContent.termsLabel}>
        {signUpContent.termsPrefix}
        <Text accessibilityRole="link" style={linkStyle} onPress={onTermsPress}>
          {signUpContent.termsLink}
        </Text>
        {signUpContent.termsJoin}
        <Text accessibilityRole="link" style={linkStyle} onPress={onPrivacyPress}>
          {signUpContent.privacyLink}
        </Text>
      </Checkbox>

      <FieldMessage error={error} />
    </View>
  );
}
