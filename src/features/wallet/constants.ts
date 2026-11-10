import type { IconName } from '@/shared/components/ui/Icon';
import type { Status } from '@/shared/components/ui/StatusPill';

export type TransactionType =
  | 'trade sale'
  | 'trade buy'
  | 'metering fee'
  | 'card deposit'
  | 'bank withdrawal'
  | 'refund'
  | 'goodwill credit';

export type WalletTransaction = {
  id: string;
  type: TransactionType;
  title: string;
  date: string;
  reference: string;
  amount: number;
  status: Status;
  icon: IconName;
};

export const walletHeader = {
  property: 'Palm Jumeirah Villa',
  initials: 'SW',
  unreadCount: 2,
};

export const walletTransactions: readonly WalletTransaction[] = [
  {
    id: '1',
    type: 'trade sale',
    title: 'Trade sale · GX-2847 · 8.4 kWh',
    date: 'Today, 14:32',
    reference: 'REF 849302',
    amount: 5.04,
    status: 'Settled',
    icon: 'north-east',
  },
  {
    id: '2',
    type: 'trade buy',
    title: 'Trade buy · GX-2841 · 4.2 kWh',
    date: 'Today, 11:10',
    reference: 'REF 849188',
    amount: -2.52,
    status: 'Settled',
    icon: 'south-west',
  },
  {
    id: '3',
    type: 'metering fee',
    title: 'Metering fee · March',
    date: 'Yesterday, 09:00',
    reference: 'REF 848977',
    amount: -1.2,
    status: 'Settled',
    icon: 'speed',
  },
  {
    id: '4',
    type: 'card deposit',
    title: 'Card deposit · VISA •••• 4242',
    date: '18 Mar 2025, 16:45',
    reference: 'REF 848612',
    amount: 100,
    status: 'Settled',
    icon: 'account-balance-wallet',
  },
  {
    id: '5',
    type: 'bank withdrawal',
    title: 'Bank withdrawal · Emirates NBD',
    date: '16 Mar 2025, 10:20',
    reference: 'REF 848104',
    amount: -50,
    status: 'Pending',
    icon: 'south-west',
  },
  {
    id: '6',
    type: 'refund',
    title: 'Refund · Trade order GX-2810',
    date: '12 Mar 2025, 13:15',
    reference: 'REF 847901',
    amount: 8.75,
    status: 'Settled',
    icon: 'sync',
  },
  {
    id: '7',
    type: 'goodwill credit',
    title: 'Goodwill credit · GridX support',
    date: '10 Mar 2025, 08:40',
    reference: 'REF 847560',
    amount: 2,
    status: 'Failed',
    icon: 'plus',
  },
];

export const transactionTypes = [
  'All types',
  'trade sale',
  'trade buy',
  'metering fee',
  'card deposit',
  'bank withdrawal',
  'refund',
  'goodwill credit',
] as const;
export const transactionStatuses = ['All statuses', 'Settled', 'Pending', 'Failed'] as const;
