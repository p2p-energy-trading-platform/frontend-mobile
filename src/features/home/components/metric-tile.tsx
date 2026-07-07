import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

export type MetricTileProps = {
  value: string;
  label: string;
};

export function MetricTile({ value, label }: MetricTileProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedText type="subtitle" style={styles.value}>
        {value}
      </ThemedText>
      <View style={styles.divider} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 96,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.16)',
  },
  value: {
    lineHeight: 38,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(127, 127, 127, 0.16)',
  },
});
