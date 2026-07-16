import { View } from 'react-native';

import { metrics } from '../constants';
import { MetricCard } from './MetricCard';

export function MetricsList() {
  return (
    <View className="gap-3">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.label}
          value={metric.value}
          label={metric.label}
          note={metric.note}
        />
      ))}
    </View>
  );
}
