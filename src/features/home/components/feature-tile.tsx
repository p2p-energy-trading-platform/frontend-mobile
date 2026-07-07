import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

const accentStyles = {
  trade: {
    chip: '#4F46E5',
    tint: '#EEF2FF',
  },
  meter: {
    chip: '#0F766E',
    tint: '#ECFDF5',
  },
  energy: {
    chip: '#B45309',
    tint: '#FFF7ED',
  },
  structure: {
    chip: '#374151',
    tint: '#F3F4F6',
  },
} as const;

export type FeatureAccent = keyof typeof accentStyles;

export type FeatureTileProps = {
  title: string;
  description: string;
  accent: FeatureAccent;
};

export function FeatureTile({ title, description, accent }: FeatureTileProps) {
  const colors = accentStyles[accent];

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={[styles.chip, { backgroundColor: colors.chip }]}>
        <View style={[styles.dot, { backgroundColor: colors.tint }]} />
      </View>
      <ThemedText type="smallBold" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
        {description}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.16)',
  },
  chip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  title: {
    marginTop: Spacing.one,
  },
  description: {
    lineHeight: 20,
  },
});
