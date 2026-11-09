import { useMemo, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { AppText } from '@/shared/components/ui/AppText';
import { FilterChips } from '@/shared/components/ui/FilterChips';
import { Icon } from '@/shared/components/ui/Icon';
import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';
import { useTheme } from '@/shared/design-system/hooks/use-theme';
import { FontFamily } from '@/shared/design-system/tokens';

import { assetViewOptions, deviceFilterOptions, devices } from '../constants';

import { AssetsPlaceholder } from './AssetsPlaceholder';
import { DeviceCard } from './DeviceCard';

type AssetView = (typeof assetViewOptions)[number]['value'];
type DeviceFilter = (typeof deviceFilterOptions)[number]['value'];

type AssetsPanelProps = {
  onAddAsset?: () => void;
};

/** Assets tab: Devices / Automation switch, filter chips, count row and the device list. */
export function AssetsPanel({ onAddAsset }: AssetsPanelProps) {
  const { theme } = useTheme();

  const [view, setView] = useState<AssetView>('devices');
  const [filter, setFilter] = useState<DeviceFilter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? devices : devices.filter((device) => device.category === filter)),
    [filter],
  );

  return (
    <View className="flex-1 gap-3">
      <View className="px-6">
        <SegmentedControl
          size="md"
          options={assetViewOptions}
          value={view}
          onChange={setView}
        />
      </View>

      {view === 'devices' ? (
        <>
          <FilterChips options={deviceFilterOptions} value={filter} onChange={setFilter} />

          <View className="flex-row items-center justify-between px-6">
            <AppText
              style={{
                color: theme.textPlaceholder,
                fontSize: 13,
                lineHeight: 18,
                fontFamily: FontFamily.body,
              }}
            >
              {visible.length} {visible.length === 1 ? 'device' : 'devices'}
            </AppText>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add asset"
              onPress={onAddAsset}
              className="flex-row items-center gap-1.5 rounded-xl py-2 pl-3 pr-3.5"
              style={{ backgroundColor: theme.accent }}
            >
              <Icon name="plus" size={16} color={theme.accentForeground} />

              <AppText
                style={{
                  color: theme.accentForeground,
                  fontSize: 13,
                  lineHeight: 18,
                  fontFamily: FontFamily.bodySemibold,
                }}
              >
                Add asset
              </AppText>
            </Pressable>
          </View>

          <FlatList
            className="flex-1"
            data={visible}
            keyExtractor={(device) => device.key}
            renderItem={({ item }) => <DeviceCard device={item} />}
            contentContainerStyle={{ gap: 12, paddingHorizontal: 24, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View className="px-6">
          <AssetsPlaceholder />
        </View>
      )}
    </View>
  );
}
