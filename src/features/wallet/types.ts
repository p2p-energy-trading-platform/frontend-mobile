import type { IconName } from '@/shared/components/ui/Icon';

export type TransactionType =
  | 'trade-sale'
  | 'trade-buy'
  | 'metering-fee'
  | 'card-deposit'
  | 'bank-withdrawal'
  | 'refund'
  | 'goodwill-credit';

export type TransactionStatus = 'settled' | 'pending' | 'failed';

export type Transaction = {
  id: string;
  type: TransactionType;
  title: string;
  date: string;
  reference: string;
  amount: string;
  direction: 'positive' | 'negative';
  status: TransactionStatus;
  icon: IconName;
};

export type PaymentMethodTab = 'cards' | 'banks';
