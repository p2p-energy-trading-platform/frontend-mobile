import type { Transaction, TransactionStatus, TransactionType } from './types';

export function filterTransactions(
  items: readonly Transaction[],
  search: string,
  type: TransactionType | 'all',
  status: TransactionStatus | 'all',
) {
  const normalized = search.trim().toLowerCase();

  return items.filter((transaction) => {
    const matchesSearch =
      !normalized ||
      transaction.title.toLowerCase().includes(normalized) ||
      transaction.reference.toLowerCase().includes(normalized) ||
      transaction.date.toLowerCase().includes(normalized);
    const matchesType = type === 'all' || transaction.type === type;
    const matchesStatus = status === 'all' || transaction.status === status;
    return matchesSearch && matchesType && matchesStatus;
  });
}
