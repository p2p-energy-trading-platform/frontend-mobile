import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { OrderPanel } from './OrderPanel';

describe('OrderPanel', () => {
  it('shows the wallet balance when buying and energy when selling', async () => {
    await renderWithProviders(<OrderPanel slotLabel="14:30 – 15:00" />);

    expect(screen.getByText('Available Balance')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Sell Energy' }));

    expect(screen.getByText('Available Energy')).toBeOnTheScreen();
    expect(screen.getByText('Estimated Proceeds')).toBeOnTheScreen();
  });

  it('fills the amount from a preset and updates the button', async () => {
    await renderWithProviders(<OrderPanel slotLabel="14:30 – 15:00" />);

    await fireEvent.press(screen.getByRole('button', { name: '50 kWh' }));

    expect(screen.getByRole('button', { name: 'Buy 50 kilowatt-hours' })).toBeEnabled();
  });

  it('disables the button and shows an error when selling more than available', async () => {
    await renderWithProviders(<OrderPanel slotLabel="14:30 – 15:00" />);

    await fireEvent.press(screen.getByRole('button', { name: 'Sell Energy' }));
    await fireEvent.changeText(screen.getByLabelText('Amount in kilowatt-hours'), '1000');

    expect(screen.getByRole('alert')).toHaveTextContent('Amount exceeds your available energy.');
    expect(screen.getByRole('button', { name: 'Sell 0 kilowatt-hours' })).toBeDisabled();
  });

  it('locks the price field for market orders', async () => {
    await renderWithProviders(<OrderPanel slotLabel="14:30 – 15:00" />);

    await fireEvent.press(screen.getByRole('button', { name: 'Market Order' }));

    expect(screen.getByLabelText('Price per kilowatt-hour')).toHaveDisplayValue(
      'Best market price',
    );
  });
});
