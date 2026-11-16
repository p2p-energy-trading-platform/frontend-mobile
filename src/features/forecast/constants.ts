export type ForecastSlot = {
  label: string;
  price: number;
  observed: number;
  confidence: number;
};

const forecastPrices = [
  0.34, 0.33, 0.32, 0.31, 0.3, 0.3, 0.31, 0.33, 0.36, 0.39, 0.42, 0.45, 0.48, 0.5, 0.49, 0.46, 0.43,
  0.4, 0.38, 0.41, 0.46, 0.53, 0.58, 0.62, 0.65, 0.64, 0.6, 0.56, 0.5, 0.45, 0.42, 0.4, 0.39, 0.41,
  0.44, 0.47, 0.5, 0.54, 0.57, 0.55, 0.51, 0.47, 0.43, 0.4, 0.38, 0.36, 0.35, 0.34,
] as const;

export const forecastSlots: readonly ForecastSlot[] = forecastPrices.map((price, index) => ({
  label: `${String(Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '30' : '00'}`,
  price,
  observed: Number((price + ((index % 5) - 2) * 0.008).toFixed(3)),
  confidence: 0.018 + (index % 4) * 0.004,
}));

export const forecastControls = {
  property: ['Palm Jumeirah Villa', 'JLT Apartment', 'Dubai Hills Home'],
  zone: ['Dubai South · GX-M5', 'JLT Zone 4', 'Dubai Marina · GX-M2'],
  issued: ['Today, 08:30 GST', 'Today, 06:00 GST', 'Yesterday, 20:30 GST'],
} as const;

export const forecastStats = {
  low: { value: 'AED 0.30', hint: '06:00 – 07:00' },
  high: { value: 'AED 0.65', hint: '12:00 – 12:30' },
  average: { value: 'AED 0.44', hint: 'Across 24 hours' },
  sell: { time: '12:00 – 12:30', price: 'AED 0.65' },
  buy: { time: '02:30 – 03:00', price: 'AED 0.30' },
} as const;

export const priceDrivers = [
  ['Solar generation', 'High', 'Strong midday generation is lowering daytime prices.'],
  ['Grid demand', 'Moderate', 'Evening demand rises as homes return and load increases.'],
  ['Temperature', '31°C', 'Warm conditions are adding cooling demand through the day.'],
  ['Grid conditions', 'Stable', 'No constraints or planned outages are expected.'],
] as const;

export const forecastInsights = [
  'Prices are expected to stay below AED 0.35/kWh before 08:00.',
  'The best sell window is around midday when solar generation peaks.',
  'Evening demand creates a second high-price period after 18:00.',
  'Shift flexible usage to the early morning to reduce your cost.',
] as const;
