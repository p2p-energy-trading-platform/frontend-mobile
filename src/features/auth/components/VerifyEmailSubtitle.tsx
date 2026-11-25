import { Text } from 'react-native';

import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { verifyEmailContent } from '../constants';

type VerifyEmailSubtitleProps = {
  recipient: string;
};

/** "We sent a 6-digit code to <email>." with the email highlighted. Used inside AuthHeader. */
export function VerifyEmailSubtitle({ recipient }: VerifyEmailSubtitleProps) {
  const { theme } = useTheme();

  return (
    <>
      {verifyEmailContent.subtitlePrefix}
      <Text style={{ fontFamily: FontFamily.bodySemibold, color: theme.text }}>{recipient}</Text>
      {'.'}
    </>
  );
}
