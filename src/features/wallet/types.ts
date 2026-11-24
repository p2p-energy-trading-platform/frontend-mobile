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
