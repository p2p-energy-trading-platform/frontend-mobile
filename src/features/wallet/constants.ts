import type { IconName } from '@/shared/components/ui/Icon';
import type { Option } from '@/shared/components/ui/types';

import type {
  PaymentCard,
  PaymentMethodTab,
  TransactionStatus,
  TransactionType,
  WalletStat,
  WalletTransaction,
  WalletView,
} from './types';

export const walletHeader = {
  subtitle: 'AED balance · Villa 47 · JLT Zone 4',
  unreadCount: 3,
  initials: 'SA',
};

export const walletBalance = {
  available: 284.5,
  pending: 7.74,
  reserved: 2.13,
  lifetimeIn: 1284.5,
};

export const walletStats: readonly WalletStat[] = [
  { label: 'Pending', caption: 'Settling', value: walletBalance.pending, highlight: true },
  { label: 'Reserved', caption: 'Open orders', value: walletBalance.reserved },
  { label: 'Lifetime in', caption: 'All deposits', value: walletBalance.lifetimeIn },
];

export const walletCards: readonly PaymentCard[] = [
  { brand: 'VISA', number: '4821', expiry: '09/27', isDefault: true },
  { brand: 'MC', number: '3802', expiry: '04/26', isDefault: false },
];

export const walletTransactions: readonly WalletTransaction[] = [
  {
    id: 'GX-2847',
    type: 'trade-sale',
    title: 'Trade sale · GX-2847 · 8.4 kWh',
    date: '17 Jul 2025 · 14:32',
    reference: 'REF-8A42F1',
    amount: 3.19,
    status: 'Settled',
  },
  {
    id: 'GX-2846',
    type: 'trade-buy',
    title: 'Trade buy · GX-2846 · 5.2 kWh',
    date: '17 Jul 2025 · 13:15',
    reference: 'REF-8A42E7',
    amount: -2.13,
    status: 'Settled',
  },
  {
    id: 'FEE-0872',
    type: 'metering-fee',
    title: 'Metering fee · Monthly service',
    date: '17 Jul 2025 · 11:50',
    reference: 'REF-8A42B0',
    amount: -0.5,
    status: 'Settled',
  },
  {
    id: 'DEP-4821',
    type: 'card-deposit',
    title: 'Card deposit · Visa 4821',
    date: '16 Jul 2025 · 09:41',
    reference: 'REF-8A3F91',
    amount: 50,
    status: 'Pending',
  },
  {
    id: 'WDR-1063',
    type: 'bank-withdrawal',
    title: 'Bank withdrawal · ADCB 9210',
    date: '15 Jul 2025 · 16:08',
    reference: 'REF-8A3D25',
    amount: -25,
    status: 'Failed',
  },
  {
    id: 'REF-0914',
    type: 'refund',
    title: 'Refund · GX-2811 · 3.0 kWh',
    date: '14 Jul 2025 · 12:20',
    reference: 'REF-8A3B06',
    amount: 1.14,
    status: 'Settled',
  },
  {
    id: 'CR-0048',
    type: 'goodwill-credit',
    title: 'Goodwill credit · Support adjustment',
    date: '12 Jul 2025 · 10:02',
    reference: 'REF-8A37AC',
    amount: 5,
    status: 'Settled',
  },
];

export const transactionTypeLabels: Record<TransactionType, string> = {
  'trade-sale': 'Trade sale',
  'trade-buy': 'Trade buy',
  'metering-fee': 'Metering fee',
  'card-deposit': 'Card deposit',
  'bank-withdrawal': 'Bank withdrawal',
  refund: 'Refund',
  'goodwill-credit': 'Goodwill credit',
};

export const transactionIcons: Record<TransactionType, IconName> = {
  'trade-sale': 'trending-up',
  'trade-buy': 'trending-down',
  'metering-fee': 'file-text',
  'card-deposit': 'account-balance-wallet',
  'bank-withdrawal': 'north-east',
  refund: 'sync',
  'goodwill-credit': 'plus',
};

export const walletViewOptions: readonly Option<WalletView>[] = [
  { label: 'Payments', value: 'payments' },
  { label: 'History', value: 'history' },
];

export const paymentMethodOptions: readonly Option<PaymentMethodTab>[] = [
  { label: 'Debit/Credit', value: 'cards' },
  { label: 'Bank accounts', value: 'banks' },
];

export const typeFilterOptions: readonly Option<'all' | TransactionType>[] = [
  { label: 'All types', value: 'all' },
  ...Object.entries(transactionTypeLabels).map(([value, label]) => ({
    label,
    value: value as TransactionType,
  })),
];

export const statusFilterOptions: readonly Option<'all' | TransactionStatus>[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Settled', value: 'Settled' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Failed', value: 'Failed' },
];
