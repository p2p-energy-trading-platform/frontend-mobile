import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { SegmentedControl } from './SegmentedControl';

const options = [
  { label: 'Usage', value: 'usage' },
  { label: 'Assets', value: 'assets' },
] as const;

describe('SegmentedControl', () => {
  it('renders every option and marks the selected one', async () => {
    await renderWithProviders(
      <SegmentedControl options={options} value="usage" onChange={jest.fn()} />,
    );

    expect(screen.getByRole('button', { name: 'Usage' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'Assets' })).not.toBeSelected();
  });

  it('calls onChange with the pressed value', async () => {
    const onChange = jest.fn();
    await renderWithProviders(
      <SegmentedControl options={options} value="usage" onChange={onChange} />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Assets' }));

    expect(onChange).toHaveBeenCalledWith('assets');
  });
});
