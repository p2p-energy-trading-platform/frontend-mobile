import { fireEvent, renderWithProviders, screen } from '@/test/render';

import { FilterChips } from './FilterChips';

const options = [
  { label: 'All', value: 'all' },
  { label: 'Solar', value: 'solar' },
  { label: 'Battery', value: 'battery' },
] as const;

describe('FilterChips', () => {
  it('renders every option', async () => {
    await renderWithProviders(<FilterChips options={options} value="all" onChange={jest.fn()} />);

    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('sets accessibilityState.selected only on the active chip', async () => {
    await renderWithProviders(<FilterChips options={options} value="solar" onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Solar' })).toBeSelected();
    expect(screen.getByRole('button', { name: 'All' })).not.toBeSelected();
    expect(screen.getByRole('button', { name: 'Battery' })).not.toBeSelected();
  });

  it('calls onChange with the pressed value', async () => {
    const onChange = jest.fn();
    await renderWithProviders(<FilterChips options={options} value="all" onChange={onChange} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Battery' }));

    expect(onChange).toHaveBeenCalledWith('battery');
  });
});
