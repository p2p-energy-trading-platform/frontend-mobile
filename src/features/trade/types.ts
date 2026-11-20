export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D';
export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type MarketStatus = 'open' | 'closed';

/** [price in AED/kWh, quantity in kWh] */
export type OrderBookRow = [number, number];

export type MarketSnapshot = {
  currentPrice: number;
  previousClose: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  status: MarketStatus;
  updatedAt: number;
};

export type Candle = {
  /** Unix seconds */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type OrderQuote = {
  availableEnergyKwh: number;
  availableBalance: number;
  marketBuyPrice: number;
  marketSellPrice: number;
  feeRate: number;
  amountPresets: readonly number[];
  defaultAmount: string;
  defaultPrice: string;
};
