import type { Option } from '@/shared/components/ui/types';

import type { MarketSnapshot, OrderBookRow, OrderQuote, Timeframe } from './types';

export const tradeHeader = {
  title: 'Trade',
  subtitle: 'Peer-to-peer market',
  initials: 'SA',
  unreadCount: 3,
};

export const marketPairLabel = 'ENERGY / AED';
export const priceUnitLabel = 'AED/kWh';

export const tradeSlots: readonly Option<string>[] = [
  { label: '14:30 – 15:00', value: '14:30-15:00' },
  { label: '15:00 – 15:30', value: '15:00-15:30' },
  { label: '15:30 – 16:00', value: '15:30-16:00' },
];

export const timeframes: readonly Timeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D'];

export const timeframeSeconds: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1H': 3600,
  '4H': 14400,
  '1D': 86400,
};

export const initialMarketSnapshot: MarketSnapshot = {
  currentPrice: 0.47,
  previousClose: 0.449,
  high24h: 0.481,
  low24h: 0.438,
  volume24h: 84620,
  status: 'open',
  updatedAt: 0,
};

export const orderQuote: OrderQuote = {
  availableEnergyKwh: 328.4,
  availableBalance: 2847.5,
  marketBuyPrice: 0.472,
  marketSellPrice: 0.47,
  feeRate: 0.02,
  amountPresets: [10, 25, 50, 100],
  defaultAmount: '25',
  defaultPrice: '0.470',
};

export const orderBookSeed: { asks: OrderBookRow[]; bids: OrderBookRow[] } = {
  asks: [
    [0.476, 148],
    [0.475, 224],
    [0.474, 95],
    [0.473, 310],
    [0.472, 182],
  ],
  bids: [
    [0.47, 265],
    [0.469, 144],
    [0.468, 380],
    [0.467, 216],
    [0.466, 105],
  ],
};
