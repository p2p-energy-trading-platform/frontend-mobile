import { View } from 'react-native';

import { SegmentedControl } from '@/shared/components/ui/SegmentedControl';

import { periodOptions, viewOptions } from '../constants';
import { formatPeriodLabel, isAtLatest, shiftDate, type Period } from '../utils';

import { DateStepper } from './DateStepper';

export type EnergyView = (typeof viewOptions)[number]['value'];

type EnergyControlsProps = {
  view: EnergyView;
  onViewChange: (view: EnergyView) => void;
  period: Period;
  onPeriodChange: (period: Period) => void;
  date: Date;
  onDateChange: (date: Date) => void;
};

/** Usage / Assets switch + Day / Week / Month pills + date stepper (Figma: "Controls"). */
export function EnergyControls({
  view,
  onViewChange,
  period,
  onPeriodChange,
  date,
  onDateChange,
}: EnergyControlsProps) {
  return (
    <View className="gap-3">
      <SegmentedControl options={viewOptions} value={view} onChange={onViewChange} />

      {view === 'usage' ? (
        <View className="flex-row items-center justify-between">
          <SegmentedControl
            size="sm"
            options={periodOptions}
            value={period}
            onChange={onPeriodChange}
          />

          <DateStepper
            label={formatPeriodLabel(date, period)}
            onPrevious={() => onDateChange(shiftDate(date, period, -1))}
            onNext={() => onDateChange(shiftDate(date, period, 1))}
            nextDisabled={isAtLatest(date, period)}
          />
        </View>
      ) : null}
    </View>
  );
}
