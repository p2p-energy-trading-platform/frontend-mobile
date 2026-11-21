import type { DetailRow, OrderRecord, TradeRecord } from './types';

export type Page<T> = {
  items: T[];
  page: number;
  totalPages: number;
  total: number;
  /** 1-based index of the first / last item on this page (0 when empty). */
  from: number;
  to: number;
};

/** Slices a list into a page; the page number is clamped to the valid range. */
export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);

  const startIndex = (current - 1) * pageSize;
  const pageItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: pageItems,
    page: current,
    totalPages,
    total,
    from: total === 0 ? 0 : startIndex + 1,
    to: startIndex + pageItems.length,
  };
}

/** "1–4 of 10 · Page 1 of 3", or `emptyLabel` when there are no results. */
export function formatPageSummary(page: Page<unknown>, emptyLabel: string) {
  if (page.total === 0) return emptyLabel;

  return `${page.from}–${page.to} of ${page.total} · Page ${page.page} of ${page.totalPages}`;
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

/** Rows shown in the details sheet for a trade. */
export function tradeDetailRows(trade: TradeRecord): DetailRow[] {
  return [
    { label: 'Side', value: capitalize(trade.side) },
    { label: 'Status', value: capitalize(trade.status) },
    { label: 'Delivery slot', value: trade.slot },
    { label: 'Date', value: trade.date },
    { label: 'Placed at', value: trade.placedAt },
    { label: 'Energy', value: trade.energy },
    { label: 'Price', value: trade.price },
    { label: 'Total', value: trade.total },
    { label: 'Role', value: trade.role },
    { label: 'Zone', value: trade.zone },
  ];
}

/** Rows shown in the details sheet for an order. */
export function orderDetailRows(order: OrderRecord): DetailRow[] {
  return [
    { label: 'Side', value: capitalize(order.side) },
    { label: 'Type', value: capitalize(order.type) },
    { label: 'Status', value: capitalize(order.status) },
    { label: 'Delivery slot', value: order.slot },
    { label: 'Date', value: order.date },
    { label: 'Placed at', value: order.placedAt },
    { label: 'Filled', value: `${order.filledKwh} / ${order.totalKwh} kWh` },
  ];
}
