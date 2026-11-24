export type TransactionType =
  | 'trade-sale'
  | 'trade-buy'
  | 'metering-fee'
  | 'card-deposit'
  | 'bank-withdrawal'
  | 'refund'
  | 'goodwill-credit';

export type TransactionStatus = 'Settled' | 'Pending' | 'Failed';
export type WalletView = 'payments' | 'history';
export type PaymentMethodTab = 'cards' | 'banks';

export type WalletTransaction = {
  id: string;
  type: TransactionType;
  title: string;
  date: string;
  reference: string;
  amount: number;
  status: TransactionStatus;
};

export type PaymentCard = {
  brand: 'VISA' | 'MC';
  number: string;
  expiry: string;
  isDefault: boolean;
};

export type WalletStat = {
  label: string;
  caption: string;
  value: number;
  highlight?: boolean;
};

export type TransactionFilters = {
  query: string;
  type: 'all' | TransactionType;
  status: 'all' | TransactionStatus;
};
