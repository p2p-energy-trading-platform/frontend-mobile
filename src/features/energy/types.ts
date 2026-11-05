import type { IconName } from '@/shared/components/ui/Icon';

/** Index into theme.chart (chart/1 … chart/5 in Figma → 0 … 4) */
export type ChartColor = 0 | 1 | 2 | 3 | 4;

export type IconTone = 'warning' | 'info' | 'accent';

export type TimeSeries = {
  generated: number[];
  consumed: number[];
  exported: number[];
};

export type BalanceSource = {
  key: string;
  label: string;
  icon: IconName;
  tone: IconTone;
  total: string;
  segments: { label: string; value: number; color: ChartColor }[];
};

export type UsageCategory = {
  key: string;
  label: string;
  value: number;
  /** chart index, or 'muted' for the neutral "Other" color */
  color: ChartColor | 'muted';
};

export type Insight = {
  key: string;
  icon: IconName;
  tone: IconTone;
  title: string;
  body: string;
};
