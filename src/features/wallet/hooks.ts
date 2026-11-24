import { useMemo, useState } from 'react';

import { filterWalletTransactions } from './utils';
import type {
  PaymentCard,
  PaymentMethodTab,
  TransactionStatus,
  TransactionType,
  WalletView,
} from './types';

export function useWalletView() {
  const [view, setView] = useState<WalletView>('payments');
  return { view, setView };
}

export function useWalletHistory() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | TransactionType>('all');
  const [status, setStatus] = useState<'all' | TransactionStatus>('all');
  const transactions = useMemo(
    () => filterWalletTransactions(query, type, status),
    [query, status, type],
  );
  return { query, setQuery, type, setType, status, setStatus, transactions };
}

export function usePaymentMethods() {
  const [tab, setTab] = useState<PaymentMethodTab>('cards');
  const [cards, setCards] = useState<PaymentCard[]>([
    { brand: 'VISA', number: '4821', expiry: '09/27', isDefault: true },
    { brand: 'MC', number: '3802', expiry: '04/26', isDefault: false },
  ]);
  const removeCard = (number: string) =>
    setCards((current) => current.filter((card) => card.number !== number));
  return { tab, setTab, cards, removeCard };
}
