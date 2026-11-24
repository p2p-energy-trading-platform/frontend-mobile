import { useMemo, useState } from 'react';

import { walletCards, walletTransactions } from './constants';
import type {
  PaymentCard,
  PaymentMethodTab,
  TransactionStatus,
  TransactionType,
  WalletView,
} from './types';
import { filterWalletTransactions } from './utils';

export function useWalletView() {
  const [view, setView] = useState<WalletView>('payments');
  return { view, setView };
}

export function useWalletHistory() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | TransactionType>('all');
  const [status, setStatus] = useState<'all' | TransactionStatus>('all');

  const transactions = useMemo(
    () => filterWalletTransactions(walletTransactions, { query, type, status }),
    [query, status, type],
  );

  return { query, setQuery, type, setType, status, setStatus, transactions };
}

export function usePaymentMethods() {
  const [tab, setTab] = useState<PaymentMethodTab>('cards');
  const [cards, setCards] = useState<readonly PaymentCard[]>(walletCards);

  const removeCard = (number: string) =>
    setCards((current) => current.filter((card) => card.number !== number));

  return { tab, setTab, cards, removeCard };
}
