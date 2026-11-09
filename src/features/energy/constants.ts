import type { Device, BalanceSource, Insight, TimeSeries, UsageCategory } from './types';

export const energyHeader = {
  title: 'Energy',
  subtitle: 'Villa 47 · JLT Zone 4',
  // replace with user / notifications data from your store
  unreadCount: 3,
  initials: 'SA',
};

export const viewOptions = [
  { label: 'Usage', value: 'usage' },
  { label: 'Assets', value: 'assets' },
] as const;

export const panelOptions = [
  { label: 'Time series', value: 'timeSeries' },
  { label: 'Balance', value: 'balance' },
  { label: 'Usage', value: 'usage' },
  { label: 'Insights', value: 'insights' },
] as const;

export const periodOptions = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
] as const;

export const solar = {
  title: 'Solar generation',
  badge: '+2.1 vs forecast',
  value: '28.4',
  unit: 'kWh',
  stats: [
    { label: 'Consumed', value: '36.0 kWh' },
    { label: 'Self-use', value: '81.7 %' },
    { label: 'Savings', value: 'AED 8.40' },
  ],
} as const;

/* ---------- Mock half-hourly series (49 samples, 00:00 → 24:00, kW) ---------- */

const gauss = (h: number, mu: number, sigma: number) =>
  Math.exp(-((h - mu) ** 2) / (2 * sigma ** 2));

function buildTimeSeries(): TimeSeries {
  const generated: number[] = [];
  const consumed: number[] = [];
  const exported: number[] = [];

  for (let i = 0; i <= 48; i++) {
    const h = i / 2;

    const gen = h >= 6 && h <= 19 ? 1.9 * gauss(h, 12.5, 2.6) : 0;
    const con =
      0.45 + 0.35 * gauss(h, 8, 1.2) + 0.45 * gauss(h, 14, 2.5) + 0.95 * gauss(h, 20, 1.8);
    const exp = Math.max(0, gen - con) * 0.5;

    generated.push(Number(gen.toFixed(3)));
    consumed.push(Number(con.toFixed(3)));
    exported.push(Number(exp.toFixed(3)));
  }

  return { generated, consumed, exported };
}

export const timeSeries = buildTimeSeries();

export const timeAxis = ['00:00', '08:00', '16:00', '24:00'] as const;

export const timeSeriesLegend = [
  { label: 'Generated', color: 2 },
  { label: 'Consumed', color: 3 },
  { label: 'Exported', color: 0 },
] as const;

/* ---------- Energy balance ---------- */

export const balanceSources: BalanceSource[] = [
  {
    key: 'solar',
    label: 'Solar',
    icon: 'sun',
    tone: 'warning',
    total: '28.4 kWh',
    segments: [
      { label: 'Home', value: 19.2, color: 3 },
      { label: 'Battery', value: 6.4, color: 0 },
      { label: 'Export', value: 2.8, color: 4 },
    ],
  },
  {
    key: 'grid',
    label: 'Grid import',
    icon: 'south-west',
    tone: 'info',
    total: '9.4 kWh',
    segments: [{ label: 'Home', value: 9.4, color: 3 }],
  },
  {
    key: 'battery',
    label: 'Battery',
    icon: 'battery',
    tone: 'accent',
    total: '7.8 kWh',
    segments: [{ label: 'Home (evening)', value: 7.8, color: 3 }],
  },
];

export const exportEarned = { label: 'Grid export earned', value: '+AED 1.22' };

/* ---------- Usage by category ---------- */

export const usageTotal = 'Total 36.0 kWh';

export const usageCategories: UsageCategory[] = [
  { key: 'ac', label: 'Air conditioning', value: 18.4, color: 0 },
  { key: 'appliances', label: 'Appliances', value: 5.6, color: 3 },
  { key: 'water-heater', label: 'Water heater', value: 4.2, color: 2 },
  { key: 'ev', label: 'EV charging', value: 3.8, color: 1 },
  { key: 'other', label: 'Other', value: 4.0, color: 'muted' },
];

/* ---------- Insights ---------- */

export const insights: Insight[] = [
  {
    key: 'export-window',
    icon: 'sun',
    tone: 'warning',
    title: 'Export window open',
    body: 'Peak export 10:30–13:30. 2.4 kWh still available at AED 0.38/kWh.',
  },
  {
    key: 'battery-evening',
    icon: 'battery',
    tone: 'accent',
    title: 'Battery covers evening peak',
    body: '9.2 kWh stored will cover 17:00–21:30, cutting imports to near zero.',
  },
  {
    key: 'off-peak-ev',
    icon: 'bolt',
    tone: 'accent',
    title: 'Off-peak EV charging',
    body: 'Charge between 01:00–05:00 at AED 0.21/kWh to save about AED 3.10.',
  },
];

/* ---------- Assets ---------- */

export const assetViewOptions = [
  { label: 'Devices', value: 'devices' },
  { label: 'Automation', value: 'automation' },
] as const;

export const deviceFilterOptions = [
  { label: 'All assets', value: 'all' },
  { label: 'Solar', value: 'solar' },
  { label: 'Battery', value: 'battery' },
  { label: 'EV', value: 'ev' },
  { label: 'Charger', value: 'charger' },
  { label: 'Flex loads', value: 'flex' },
] as const;

export const devices: Device[] = [
  {
    key: 'solar',
    name: 'Rooftop Solar Array',
    model: 'JA Solar · JAM72S20 370/MR',
    icon: 'sun',
    category: 'solar',
    status: 'online',
    tone: 'warning',
    value: '+3.4',
    unit: 'kW',
    activity: 'Generating',
    health: 'good',
    lastSeen: 'Just now',
    control: 'monitoring',
  },
  {
    key: 'battery',
    name: 'Home Battery',
    model: 'Tesla · Powerwall 2',
    icon: 'battery',
    category: 'battery',
    status: 'online',
    tone: 'accent',
    value: '+1.2',
    unit: 'kW',
    activity: 'Charging',
    stateOfCharge: 67,
    health: 'good',
    lastSeen: '1 min ago',
    control: 'controllable',
  },
  {
    key: 'ev',
    name: 'Tesla Model Y',
    model: 'Tesla · Model Y Long Range',
    icon: 'car',
    category: 'ev',
    status: 'idle',
    tone: 'purple',
    value: '0',
    unit: 'kW',
    activity: 'Active draw',
    stateOfCharge: 67,
    health: 'good',
    lastSeen: '8 min ago',
    control: 'controllable',
  },
  {
    key: 'charger',
    name: 'EV Charger',
    model: 'Wallbox · Pulsar Plus 22',
    icon: 'plug',
    category: 'charger',
    status: 'idle',
    tone: 'accent',
    value: '0',
    unit: 'kW',
    activity: 'Active draw',
    health: 'good',
    lastSeen: '3 min ago',
    control: 'controllable',
  },
  {
    key: 'water-heater',
    name: 'Water Heater',
    model: 'Ariston · Lydos Hybrid 80L',
    icon: 'droplets',
    category: 'flex',
    status: 'online',
    tone: 'info',
    value: '+0.8',
    unit: 'kW',
    activity: 'Active draw',
    health: 'degraded',
    lastSeen: '5 min ago',
    control: 'controllable',
  },
  {
    key: 'hvac',
    name: 'HVAC — Main Zone',
    model: 'Daikin · SkyAir RZQS100',
    icon: 'wind',
    category: 'flex',
    status: 'online',
    tone: 'purple',
    value: '+3.2',
    unit: 'kW',
    activity: 'Active draw',
    health: 'good',
    lastSeen: '2 min ago',
    control: 'monitoring',
  },
];

