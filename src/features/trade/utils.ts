import { formatAed } from '@/shared/utils/format';

import { timeframeSeconds } from './constants';
import type {
  Candle,
  MarketSnapshot,
  MarketStatus,
  OrderBookRow,
  OrderQuote,
  OrderSide,
  OrderType,
  Timeframe,
} from './types';

const GST_OFFSET_HOURS = 4;

export function formatPrice(value: number) {
  return formatAed(value, 3);
}

export function formatKwh(value: number) {
  return `${value.toLocaleString('en-US')} kWh`;
}

/** Demo market hours: Monday–Friday, 08:00–22:00 Gulf Standard Time (UTC+4, no DST). */
export function getMarketStatus(date: Date): MarketStatus {
  const gst = new Date(date.getTime() + GST_OFFSET_HOURS * 3600 * 1000);
  const day = gst.getUTCDay();
  const hour = gst.getUTCHours();
  const weekday = day !== 0 && day !== 6;

  return weekday && hour >= 8 && hour < 22 ? 'open' : 'closed';
}

export function getPercentageChange(snapshot: MarketSnapshot) {
  return ((snapshot.currentPrice - snapshot.previousClose) / snapshot.previousClose) * 100;
}

export function advanceMarketSnapshot(
  snapshot: MarketSnapshot,
  now: Date,
  random = Math.random,
): MarketSnapshot {
  const status = getMarketStatus(now);
  if (status === 'closed') return { ...snapshot, status, updatedAt: now.getTime() };

  const nextPrice = Math.max(
    0.4,
    Math.min(0.55, snapshot.currentPrice + (random() - 0.48) * 0.001),
  );

  return {
    ...snapshot,
    currentPrice: nextPrice,
    high24h: Math.max(snapshot.high24h, nextPrice),
    low24h: Math.min(snapshot.low24h, nextPrice),
    volume24h: snapshot.volume24h + Math.floor(random() * 24) + 4,
    status,
    updatedAt: now.getTime(),
  };
}

export function makeCandles(timeframe: Timeframe, count = 40, nowMs = Date.now()): Candle[] {
  const step = timeframeSeconds[timeframe];
  const now = Math.floor(nowMs / 1000 / step) * step;
  let last = 0.444;

  return Array.from({ length: count }, (_, index) => {
    const drift = Math.sin(index * 0.57) * 0.0026 + Math.cos(index * 0.21) * 0.0012;
    const open = last;
    const close = Math.max(0.41, open + drift);
    const high = Math.max(open, close) + 0.0012 + (index % 3) * 0.00035;
    const low = Math.min(open, close) - 0.0011 - (index % 4) * 0.00025;
    last = close;

    return { time: now - (count - 1 - index) * step, open, high, low, close };
  });
}

export function getSpread(asks: OrderBookRow[], bids: OrderBookRow[]) {
  const bestAsk = Math.min(...asks.map(([price]) => price));
  const bestBid = Math.max(...bids.map(([price]) => price));

  return bestAsk - bestBid;
}

type OrderInput = {
  side: OrderSide;
  orderType: OrderType;
  amount: string;
  price: string;
  quote: OrderQuote;
};

export type OrderSummary = {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  fee: number;
  total: number;
  error?: string;
  valid: boolean;
};

export function calculateOrder({
  side,
  orderType,
  amount,
  price,
  quote,
}: OrderInput): OrderSummary {
  const quantity = Number(amount);
  const unitPrice =
    orderType === 'market'
      ? side === 'buy'
        ? quote.marketBuyPrice
        : quote.marketSellPrice
      : Number(price);

  const inputsValid =
    Number.isFinite(quantity) && quantity > 0 && Number.isFinite(unitPrice) && unitPrice > 0;
  const subtotal = inputsValid ? quantity * unitPrice : 0;
  const fee = subtotal * quote.feeRate;
  const total = side === 'buy' ? subtotal + fee : subtotal - fee;

  let error: string | undefined;
  if (side === 'sell' && quantity > quote.availableEnergyKwh) {
    error = 'Amount exceeds your available energy.';
  } else if (side === 'buy' && total > quote.availableBalance) {
    error = 'Total cost exceeds your available balance.';
  }

  return { quantity, unitPrice, subtotal, fee, total, error, valid: inputsValid && !error };
}
