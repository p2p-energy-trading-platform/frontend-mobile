import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { PaymentMethods } from './PaymentMethods';

const removeLabel = 'Remove Mastercard ending in 3802';

describe('PaymentMethods', () => {
  it('keeps the card when removal is cancelled', async () => {
    await renderWithProviders(<PaymentMethods onAdd={jest.fn()} onLink={jest.fn()} />);

    await fireEvent.press(screen.getByRole('button', { name: removeLabel }));
    await fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Mastercard •••• 3802')).toBeOnTheScreen();
  });

  it('removes the card after confirming', async () => {
    await renderWithProviders(<PaymentMethods onAdd={jest.fn()} onLink={jest.fn()} />);

    await fireEvent.press(screen.getByRole('button', { name: removeLabel }));
    await fireEvent.press(screen.getByRole('button', { name: 'Remove' }));

    expect(screen.queryByText('Mastercard •••• 3802')).not.toBeOnTheScreen();
  });

  it('does not allow removing the default card', async () => {
    await renderWithProviders(<PaymentMethods onAdd={jest.fn()} onLink={jest.fn()} />);

    expect(
      screen.queryByRole('button', { name: 'Remove Visa ending in 4821' }),
    ).not.toBeOnTheScreen();
  });
});
