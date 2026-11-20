import { useEffect, useMemo, useState } from 'react';

import { initialMarketSnapshot, orderBookSeed } from './constants';
import type { OrderBookRow, Timeframe } from './types';
import { advanceMarketSnapshot, getSpread, makeCandles } from './utils';

// Demo data that ticks like a live feed, same as the web terminal.
// TODO(api): replace with the market data endpoints / websocket.

export function useMarket() {
  const [snapshot, setSnapshot] = useState(() =>
    advanceMarketSnapshot(initialMarketSnapshot, new Date()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setSnapshot((current) => advanceMarketSnapshot(current, new Date()));
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return snapshot;
}

export function useCandles(timeframe: Timeframe) {
  return useMemo(() => makeCandles(timeframe), [timeframe]);
}

function jitter(rows: OrderBookRow[]): OrderBookRow[] {
  return rows.map(([price, quantity]) => [
    price,
    Math.max(20, quantity + Math.round((Math.random() - 0.5) * 18)),
  ]);
}

export function useOrderBook() {
  const [asks, setAsks] = useState(orderBookSeed.asks);
  const [bids, setBids] = useState(orderBookSeed.bids);

  useEffect(() => {
    const timer = setInterval(() => {
      setAsks(jitter);
      setBids(jitter);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return { asks, bids, spread: getSpread(asks, bids) };
}
