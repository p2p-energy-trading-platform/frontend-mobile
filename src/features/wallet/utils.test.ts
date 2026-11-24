import { transactions } from './constants';
import { filterTransactions } from './utils';

describe('filterTransactions', () => {
  it('filters by search text', () => {
    expect(filterTransactions(transactions, 'GX-2847', 'all', 'all')).toHaveLength(1);
  });

  it('combines type and status filters', () => {
    expect(filterTransactions(transactions, '', 'trade-sale', 'settled')).toHaveLength(1);
  });

  it('returns an empty list when there are no matches', () => {
    expect(filterTransactions(transactions, 'not-found', 'all', 'all')).toEqual([]);
  });
});
