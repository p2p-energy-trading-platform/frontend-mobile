import { walletTransactions } from './constants';
import { filterWalletTransactions, transactionsToCsv } from './utils';

const noFilters = { query: '', type: 'all', status: 'all' } as const;

describe('filterWalletTransactions', () => {
  it('returns everything when no filter is set', () => {
    expect(filterWalletTransactions(walletTransactions, noFilters)).toHaveLength(
      walletTransactions.length,
    );
  });

  it('filters by type and status', () => {
    const byType = filterWalletTransactions(walletTransactions, { ...noFilters, type: 'refund' });
    expect(byType.map((transaction) => transaction.id)).toEqual(['REF-0914']);

    const byStatus = filterWalletTransactions(walletTransactions, {
      ...noFilters,
      status: 'Failed',
    });
    expect(byStatus.map((transaction) => transaction.id)).toEqual(['WDR-1063']);
  });

  it('searches title, reference and type label, ignoring case and spaces', () => {
    const byReference = filterWalletTransactions(walletTransactions, {
      ...noFilters,
      query: '  ref-8a3f91 ',
    });
    expect(byReference.map((transaction) => transaction.id)).toEqual(['DEP-4821']);

    const byLabel = filterWalletTransactions(walletTransactions, {
      ...noFilters,
      query: 'metering',
    });
    expect(byLabel.map((transaction) => transaction.id)).toEqual(['FEE-0872']);
  });

  it('returns nothing when filters do not match together', () => {
    expect(
      filterWalletTransactions(walletTransactions, {
        query: '',
        type: 'refund',
        status: 'Failed',
      }),
    ).toHaveLength(0);
  });
});

describe('transactionsToCsv', () => {
  it('writes a header row and one quoted row per transaction', () => {
    const [header, ...rows] = transactionsToCsv(walletTransactions.slice(0, 2)).split('\n');

    expect(header).toBe('"Date","Type","Description","Reference","Amount AED","Status"');
    expect(rows).toEqual([
      '"17 Jul 2025 · 14:32","Trade sale","Trade sale · GX-2847 · 8.4 kWh","REF-8A42F1","3.19","Settled"',
      '"17 Jul 2025 · 13:15","Trade buy","Trade buy · GX-2846 · 5.2 kWh","REF-8A42E7","-2.13","Settled"',
    ]);
  });

  it('escapes quotes inside values', () => {
    const [transaction] = walletTransactions;
    const csv = transactionsToCsv([{ ...transaction!, title: 'Say "hi"' }]);

    expect(csv.split('\n')[1]).toContain('"Say ""hi"""');
  });
});
