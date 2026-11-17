import type { IconName } from '@/shared/components/ui/Icon';

export type HistoryTab = 'trades' | 'orders' | 'statements';

export type HistoryTabOption = {
  label: string;
  value: HistoryTab;
  icon: IconName;
};

export type TradeSide = 'buy' | 'sell';

export type TradeStatus = 'settled' | 'pending' | 'failed';

export type TradeStatusFilter = TradeStatus | 'all';

export type TradeRecord = {
  /** e.g. "GX-2847" */
  id: string;
  side: TradeSide;
  status: TradeStatus;
  /** Delivery slot, e.g. "14:00–14:30" */
  slot: string;
  /** e.g. "17 Jul" */
  date: string;
  /** Time the trade was placed, e.g. "14:32" */
  placedAt: string;
  /** e.g. "8.4 kWh" */
  energy: string;
  /** e.g. "AED 0.380/kWh" */
  price: string;
  /** e.g. "AED 3.192" */
  total: string;
  /** e.g. "Participant" */
  role: string;
  /** e.g. "Dubai South" */
  zone: string;
};

export type OrderType = 'limit' | 'market';

export type OrderStatus = 'open' | 'partial' | 'filled' | 'cancelled';

export type OrderStatusFilter = OrderStatus | 'all';

export type OrderRecord = {
  /** e.g. "GX-2847" */
  id: string;
  side: TradeSide;
  type: OrderType;
  status: OrderStatus;
  /** Delivery slot, e.g. "14:00–14:30" */
  slot: string;
  /** e.g. "17 Jul" */
  date: string;
  /** Time the order was placed, e.g. "14:28" */
  placedAt: string;
  filledKwh: number;
  totalKwh: number;
};
