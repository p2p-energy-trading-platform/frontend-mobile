import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/shared/components/ui/Icon';
import { useTheme } from '@/shared/design-system/hooks/use-theme';

import type { StatementRecord } from '../types';

type StatementRowProps = {
  statement: StatementRecord;
  /** Hide the bottom divider on the last row of the card. */
  isLast?: boolean;
  onDownload?: (statement: StatementRecord) => void;
};

/** One statement row: icon, title + reference/size/issued date, PDF download button. */
export function StatementRow({ statement, isLast = false, onDownload }: StatementRowProps) {
  const { theme } = useTheme();

  return (
    <View
      className={`flex-row items-center gap-3 px-5 py-4 ${isLast ? '' : 'border-b'}`}
      style={{ borderColor: theme.border }}
    >
      <View
        className="h-9 w-9 items-center justify-center rounded-2xl"
        style={{ backgroundColor: theme.feedback.info.background }}
      >
        <Icon name="file-text" size={15} color={theme.feedback.info.icon} />
      </View>

      <View className="flex-1">
        <Text className="font-body-semibold text-sm leading-5" style={{ color: theme.text }}>
          {statement.title}
        </Text>

        <Text className="mt-0.5 font-mono text-[11px] leading-4" style={{ color: theme.textDisabled }}>
          {statement.id} · {statement.size}
          {'\n'}Issued {statement.issued}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Download ${statement.title} as PDF`}
        onPress={() => onDownload?.(statement)}
        className="min-h-7 flex-row items-center gap-1.5 rounded-xl border px-3 py-1.5"
        style={{ borderColor: theme.border }}
      >
        <Icon name="download" size={12} color={theme.textTertiary} />

        <Text className="font-body-semibold text-xs" style={{ color: theme.textTertiary }}>
          PDF
        </Text>
      </Pressable>
    </View>
  );
}
