import { transactionTypeLabels } from './constants';
import type { TransactionFilters, WalletTransaction } from './types';

export function filterWalletTransactions(
  transactions: readonly WalletTransaction[],
  { query, type, status }: TransactionFilters,
): readonly WalletTransaction[] {
  const normalizedQuery = query.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesType = type === 'all' || transaction.type === type;
    const matchesStatus = status === 'all' || transaction.status === status;
    const matchesSearch =
      !normalizedQuery ||
      [
        transaction.title,
        transaction.date,
        transaction.reference,
        transaction.status,
        transactionTypeLabels[transaction.type],
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    return matchesType && matchesStatus && matchesSearch;
  });
}

export function transactionsToCsv(transactions: readonly WalletTransaction[]): string {
  const rows = [
    ['Date', 'Type', 'Description', 'Reference', 'Amount AED', 'Status'],
    ...transactions.map((transaction) => [
      transaction.date,
      transactionTypeLabels[transaction.type],
      transaction.title,
      transaction.reference,
      transaction.amount.toFixed(2),
      transaction.status,
    ]),
  ];

  return rows
    .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
    .join('\n');
}
