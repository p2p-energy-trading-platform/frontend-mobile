import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { TransactionHistory } from './TransactionHistory';

describe('TransactionHistory', () => {
  it('shows an empty state when the search has no match', async () => {
    await renderWithProviders(<TransactionHistory onExport={jest.fn()} />);

    await fireEvent.changeText(screen.getByLabelText('Search transactions'), 'no-such-thing');

    expect(
      screen.getByText('No transactions found. Try another search or filter.'),
    ).toBeOnTheScreen();
  });

  it('exports only the filtered transactions', async () => {
    const onExport = jest.fn();
    await renderWithProviders(<TransactionHistory onExport={onExport} />);

    await fireEvent.changeText(screen.getByLabelText('Search transactions'), 'REF-8A3F91');
    await fireEvent.press(
      screen.getByRole('button', { name: 'Export filtered transactions as CSV' }),
    );

    const rows = (onExport.mock.calls[0]?.[0] as string).split('\n');
    expect(rows).toHaveLength(2);
    expect(rows[1]).toContain('REF-8A3F91');
  });
});
