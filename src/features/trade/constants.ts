export type TradeSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';
export type PriceRange = '1H' | '4H' | '1D';

export type TradeSlot = {
  label: string;
  value: string;
};

export const tradeHeader = {
  title: 'Trade',
  subtitle: 'Dubai, United Arab Emirates',
  initials: 'SW',
  unreadCount: 2,
};

export const tradeSlots: readonly TradeSlot[] = [
  { label: '14:30 – 15:00', value: '14:30 – 15:00' },
  { label: '15:00 – 15:30', value: '15:00 – 15:30' },
  { label: '15:30 – 16:00', value: '15:30 – 16:00' },
];

export const priceRanges: readonly PriceRange[] = ['1H', '4H', '1D'];

export const priceSeries: Record<PriceRange, readonly number[]> = {
  '1H': [0.51, 0.53, 0.52, 0.55, 0.54, 0.57, 0.56, 0.59, 0.58, 0.6],
  '4H': [0.43, 0.47, 0.45, 0.51, 0.49, 0.54, 0.52, 0.57, 0.55, 0.6],
  '1D': [0.38, 0.44, 0.42, 0.49, 0.46, 0.53, 0.5, 0.56, 0.54, 0.6],
};

export const tradePrice = 0.6;
export const priceChange = 0.04;
export const availableBalance = 24.5;
export const bestAsk = 0.61;
export const openOrderCount = 3;
export const bestSellPrice = 0.61;
export const bestBuyPrice = 0.59;
export const quickAmounts = [2, 5, 10] as const;
