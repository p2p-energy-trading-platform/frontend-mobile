import { Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import { kycContent } from '../constants';
import type { PickedDocument } from '../types';

type UploadFieldProps = {
  title: string;
  /** Hint shown until a file is picked. */
  description: string;
  document?: PickedDocument;
  error?: string;
  /** Blocks taps, e.g. while a file picker is already open. */
  disabled?: boolean;
  onBrowse: () => void;
};

/** Dashed row with an upload tile, title and a "Browse" action (Figma: Upload). */
export function UploadField({
  title,
  description,
  document,
  error,
  disabled = false,
  onBrowse,
}: UploadFieldProps) {
  const { theme } = useTheme();
  const picked = Boolean(document);

  return (
    <View className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${picked ? kycContent.replace : kycContent.browse} ${title}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onBrowse}
        className="flex-row items-center gap-3 rounded-2xl border border-dashed py-3 pl-3 pr-4"
        style={{
          backgroundColor: theme.surface,
          borderColor: error ? theme.error : theme.borderInput,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <View
          className="h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: theme.surfaceSecondary }}
        >
          <Icon
            name={picked ? 'check-circle' : 'upload'}
            size={16}
            color={picked ? theme.success : theme.textSecondary}
          />
        </View>

        <View className="flex-1 gap-0.5">
          <AppText preset="bodySemibold" numberOfLines={1}>
            {title}
          </AppText>
          <AppText preset="caption" tone="textPlaceholder" numberOfLines={1}>
            {document?.name ?? description}
          </AppText>
        </View>

        <AppText preset="label" tone="accent">
          {picked ? kycContent.replace : kycContent.browse}
        </AppText>
      </Pressable>

      {error ? (
        <AppText accessibilityRole="alert" preset="caption" tone="error">
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
