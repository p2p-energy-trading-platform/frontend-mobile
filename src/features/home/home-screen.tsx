import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatureTile } from './components/feature-tile';
import { MetricTile } from './components/metric-tile';
import { homeFeatures, homeStats, projectStructure } from './home-data';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function ActionButton({
  label,
  variant = 'primary',
}: {
  label: string;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <ThemedView
      type={variant === 'primary' ? 'backgroundSelected' : 'backgroundElement'}
      style={[styles.actionButton, variant === 'secondary' && styles.secondaryButton]}>
      <ThemedText type="smallBold">{label}</ThemedText>
    </ThemedView>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedView type="backgroundElement" style={styles.heroCard}>
            <ThemedText type="code" style={styles.kicker}>
              GRIDX MOBILE DEMO
            </ThemedText>

            <ThemedText type="title" style={styles.heroTitle}>
              Peer-to-peer energy trading for local power grids.
            </ThemedText>

            <ThemedText type="default" themeColor="textSecondary" style={styles.heroCopy}>
              This sample screen mirrors the web landing page and keeps the route thin while the
              feature module owns the real UI, data, and layout.
            </ThemedText>

            <View style={styles.actionRow}>
              <ActionButton label="Open dashboard" />
              <ActionButton label="Inspect structure" variant="secondary" />
            </View>
          </ThemedView>

          <View style={styles.statsRow}>
            {homeStats.map((item) => (
              <MetricTile key={item.label} value={item.value} label={item.label} />
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
              FEATURE MODULES
            </ThemedText>
            <ThemedText type="subtitle">Landing-page content, broken into features.</ThemedText>
          </View>

          <View style={styles.featureGrid}>
            {homeFeatures.map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <FeatureTile
                  title={feature.title}
                  description={feature.description}
                  accent={feature.accent}
                />
              </View>
            ))}
          </View>

          <ThemedView type="backgroundElement" style={styles.structureCard}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.sectionLabel}>
              FEATURE-DRIVEN STRUCTURE
            </ThemedText>
            <ThemedText type="subtitle" style={styles.structureTitle}>
              The app shell stays in routes. Product UI lives in feature folders.
            </ThemedText>

            <View style={styles.structureList}>
              {projectStructure.map((entry) => (
                <View key={entry.path} style={styles.structureRow}>
                  <ThemedText type="code" style={styles.structurePath}>
                    {entry.path}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.structureDescription}>
                    {entry.description}
                  </ThemedText>
                </View>
              ))}
            </View>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.five,
    gap: Spacing.four,
  },
  heroCard: {
    borderRadius: 32,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.16)',
  },
  kicker: {
    letterSpacing: 1.4,
  },
  heroTitle: {
    fontSize: 42,
    lineHeight: 46,
  },
  heroCopy: {
    maxWidth: 560,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingTop: Spacing.one,
  },
  actionButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.four,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.12)',
  },
  secondaryButton: {
    opacity: 0.92,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sectionHeader: {
    gap: Spacing.one,
  },
  sectionLabel: {
    letterSpacing: 1.2,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.one,
  },
  featureItem: {
    width: '50%',
    padding: Spacing.one,
    minWidth: 220,
    flexGrow: 1,
  },
  structureCard: {
    borderRadius: 28,
    padding: Spacing.five,
    gap: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(127, 127, 127, 0.16)',
  },
  structureTitle: {
    maxWidth: 540,
  },
  structureList: {
    gap: Spacing.two,
  },
  structureRow: {
    gap: Spacing.one,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(127, 127, 127, 0.12)',
  },
  structurePath: {
    fontSize: 13,
  },
  structureDescription: {
    lineHeight: 20,
  },
});
