import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { DateStepper } from './DateStepper';

describe('DateStepper', () => {
  it('shows the label and calls onPrevious / onNext', async () => {
    const onPrevious = jest.fn();
    const onNext = jest.fn();
    await renderWithProviders(
      <DateStepper label="Wed, 11 Nov" onPrevious={onPrevious} onNext={onNext} />,
    );

    expect(screen.getByText('Wed, 11 Nov')).toBeOnTheScreen();

    await fireEvent.press(screen.getByLabelText('Previous period'));
    await fireEvent.press(screen.getByLabelText('Next period'));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables the next button when nextDisabled is true', async () => {
    const onNext = jest.fn();
    await renderWithProviders(
      <DateStepper label="Wed, 11 Nov" onPrevious={jest.fn()} onNext={onNext} nextDisabled />,
    );

    const next = screen.getByLabelText('Next period');
    expect(next).toBeDisabled();

    await fireEvent.press(next);
    expect(onNext).not.toHaveBeenCalled();
  });
});
