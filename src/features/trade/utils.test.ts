import { initialMarketSnapshot, orderQuote } from './constants';
import {
  advanceMarketSnapshot,
  calculateOrder,
  formatAed,
  getMarketStatus,
  getPercentageChange,
  getSpread,
  makeCandles,
} from './utils';

describe('getMarketStatus', () => {
  it.each([
    ['Wednesday 10:00 GST', '2026-11-11T06:00:00Z', 'open'],
    ['Wednesday 07:59 GST', '2026-11-11T03:59:00Z', 'closed'],
    ['Wednesday 22:00 GST', '2026-11-11T18:00:00Z', 'closed'],
    ['Saturday 12:00 GST', '2026-11-14T08:00:00Z', 'closed'],
    ['Friday 21:59 GST', '2026-11-13T17:59:00Z', 'open'],
  ])('%s is %s', (_label, iso, status) => {
    expect(getMarketStatus(new Date(iso))).toBe(status);
  });
});

describe('getPercentageChange', () => {
  it('compares the current price to the previous close', () => {
    expect(getPercentageChange(initialMarketSnapshot)).toBeCloseTo(4.677, 2);
  });
});

describe('advanceMarketSnapshot', () => {
  it('only updates the timestamp when the market is closed', () => {
    const now = new Date('2026-11-14T08:00:00Z');
    const next = advanceMarketSnapshot(initialMarketSnapshot, now, () => 0.9);

    expect(next.currentPrice).toBe(initialMarketSnapshot.currentPrice);
    expect(next.status).toBe('closed');
    expect(next.updatedAt).toBe(now.getTime());
  });

  it('moves the price and keeps high/low in sync when open', () => {
    const next = advanceMarketSnapshot(
      { ...initialMarketSnapshot, high24h: 0.47 },
      new Date('2026-11-11T06:00:00Z'),
      () => 1,
    );

    expect(next.currentPrice).toBeGreaterThan(0.47);
    expect(next.high24h).toBe(next.currentPrice);
    expect(next.volume24h).toBeGreaterThan(initialMarketSnapshot.volume24h);
  });
});

describe('makeCandles', () => {
  it('returns candles one timeframe apart, ending at the current bucket', () => {
    const now = Date.UTC(2026, 10, 11, 10, 30);
    const candles = makeCandles('1H', 5, now);

    expect(candles).toHaveLength(5);
    expect(candles[4]!.time).toBe(Date.UTC(2026, 10, 11, 10) / 1000);
    expect(candles[1]!.time - candles[0]!.time).toBe(3600);
  });

  it('keeps every high above and every low below the body', () => {
    for (const candle of makeCandles('5m')) {
      expect(candle.high).toBeGreaterThanOrEqual(Math.max(candle.open, candle.close));
      expect(candle.low).toBeLessThanOrEqual(Math.min(candle.open, candle.close));
    }
  });
});

describe('getSpread', () => {
  it('is the best ask minus the best bid', () => {
    expect(
      getSpread(
        [
          [0.476, 1],
          [0.472, 1],
        ],
        [
          [0.47, 1],
          [0.466, 1],
        ],
      ),
    ).toBeCloseTo(0.002, 6);
  });
});

describe('calculateOrder', () => {
  const base = { orderType: 'limit' as const, quote: orderQuote };

  it('adds the fee for buyers and takes it off for sellers', () => {
    const buy = calculateOrder({ ...base, side: 'buy', amount: '100', price: '0.5' });
    const sell = calculateOrder({ ...base, side: 'sell', amount: '100', price: '0.5' });

    expect(buy).toMatchObject({ subtotal: 50, fee: 1, total: 51, valid: true });
    expect(sell).toMatchObject({ subtotal: 50, fee: 1, total: 49, valid: true });
  });

  it('uses the market price for market orders', () => {
    const buy = calculateOrder({
      ...base,
      orderType: 'market',
      side: 'buy',
      amount: '10',
      price: '',
    });
    const sell = calculateOrder({
      ...base,
      orderType: 'market',
      side: 'sell',
      amount: '10',
      price: '',
    });

    expect(buy.unitPrice).toBe(orderQuote.marketBuyPrice);
    expect(sell.unitPrice).toBe(orderQuote.marketSellPrice);
  });

  it('checks the energy balance when selling', () => {
    const order = calculateOrder({ ...base, side: 'sell', amount: '500', price: '0.47' });

    expect(order.valid).toBe(false);
    expect(order.error).toMatch(/available energy/);
  });

  it('checks the wallet balance when buying', () => {
    const order = calculateOrder({ ...base, side: 'buy', amount: '7000', price: '0.47' });

    expect(order.valid).toBe(false);
    expect(order.error).toMatch(/available balance/);
  });

  it.each(['', '0', '-5', 'abc'])('rejects amount %p', (amount) => {
    expect(calculateOrder({ ...base, side: 'buy', amount, price: '0.47' }).valid).toBe(false);
  });
});

describe('formatAed', () => {
  it('formats with thousands separators', () => {
    expect(formatAed(2847.5)).toBe('AED 2,847.50');
    expect(formatAed(0.47, 3)).toBe('AED 0.470');
  });
});
