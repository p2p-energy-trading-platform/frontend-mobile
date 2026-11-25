import { AppText } from './AppText';

type FieldMessageProps = {
  error?: string;
  helper?: string;
};

/** Error (preferred) or helper text shown under a field, so every form reads the same. */
export function FieldMessage({ error, helper }: FieldMessageProps) {
  if (error) {
    return (
      <AppText accessibilityRole="alert" preset="caption" tone="error">
        {error}
      </AppText>
    );
  }

  if (helper) {
    return (
      <AppText preset="caption" tone="textPlaceholder">
        {helper}
      </AppText>
    );
  }

  return null;
}
