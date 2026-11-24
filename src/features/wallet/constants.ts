import type { Option } from '@/shared/components/ui/types';

import type { PaymentMethodTab, Transaction, TransactionStatus, TransactionType } from './types';

export const walletHeader = {
  title: 'Wallet',
  property: 'Villa 47 · JLT Zone 4',
};

export const transactions: readonly Transaction[] = [
  {
    id: 'TX-2847',
    type: 'trade-sale',
    title: 'Trade sale · GX-2847 · 8.4 kWh',
    date: '17 Jul 2026',
    reference: 'REF-1047',
    amount: '+AED 42.80',
    direction: 'positive',
    status: 'settled',
    icon: 'trending-up',
  },
  {
    id: 'TX-2846',
    type: 'trade-buy',
    title: 'Trade buy · GX-2846 · 5.2 kWh',
    date: '17 Jul 2026',
    reference: 'REF-1046',
    amount: '-AED 21.32',
    direction: 'negative',
    status: 'settled',
    icon: 'trending-down',
  },
  {
    id: 'TX-2845',
    type: 'metering-fee',
    title: 'Metering fee · GX-2845',
    date: '16 Jul 2026',
    reference: 'REF-1045',
    amount: '-AED 1.20',
    direction: 'negative',
    status: 'settled',
    icon: 'bolt',
  },
  {
    id: 'TX-2844',
    type: 'card-deposit',
    title: 'Card deposit · VISA 4242',
    date: '15 Jul 2026',
    reference: 'REF-1044',
    amount: '+AED 150.00',
    direction: 'positive',
    status: 'pending',
    icon: 'south-west',
  },
  {
    id: 'TX-2843',
    type: 'bank-withdrawal',
    title: 'Bank withdrawal · **** 8888',
    date: '14 Jul 2026',
    reference: 'REF-1043',
    amount: '-AED 75.00',
    direction: 'negative',
    status: 'pending',
    icon: 'north-east',
  },
  {
    id: 'TX-2842',
    type: 'refund',
    title: 'Trade refund · GX-2842',
    date: '13 Jul 2026',
    reference: 'REF-1042',
    amount: '+AED 12.50',
    direction: 'positive',
    status: 'settled',
    icon: 'sync',
  },
  {
    id: 'TX-2841',
    type: 'goodwill-credit',
    title: 'Goodwill credit',
    date: '12 Jul 2026',
    reference: 'REF-1041',
    amount: '+AED 25.00',
    direction: 'positive',
    status: 'failed',
    icon: 'shield-check',
  },
] as const;

export const transactionTypeOptions: readonly Option<TransactionType | 'all'>[] = [
  { label: 'All types', value: 'all' },
  { label: 'Trade sale', value: 'trade-sale' },
  { label: 'Trade buy', value: 'trade-buy' },
  { label: 'Metering fee', value: 'metering-fee' },
  { label: 'Card deposit', value: 'card-deposit' },
  { label: 'Bank withdrawal', value: 'bank-withdrawal' },
  { label: 'Refund', value: 'refund' },
  { label: 'Goodwill credit', value: 'goodwill-credit' },
] as const;

export const transactionStatusOptions: readonly Option<TransactionStatus | 'all'>[] = [
  { label: 'All statuses', value: 'all' },
  { label: 'Settled', value: 'settled' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
] as const;

export const paymentMethodOptions: readonly Option<PaymentMethodTab>[] = [
  { label: 'Debit/Credit', value: 'cards' },
  { label: 'Bank accounts', value: 'banks' },
] as const;
