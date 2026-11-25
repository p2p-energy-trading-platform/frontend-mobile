import { router } from 'expo-router';

import { fireEvent, renderWithProviders, screen } from '@/test/render';

import KycScreen from './KycScreen';
import { kycContent } from './constants';

jest.mock('./pick-document', () => ({ pickDocument: jest.fn() }));

describe('KycScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows what is missing and stays on the screen when submitted empty', async () => {
    await renderWithProviders(<KycScreen />);

    const submit = screen.getByRole('button', { name: kycContent.submit });
    expect(submit).toBeEnabled();

    await fireEvent.press(submit);

    expect(screen.getByText('Full legal name is required')).toBeOnTheScreen();
    expect(screen.getByText('Enter a valid Sri Lankan NIC number')).toBeOnTheScreen();
    expect(screen.getByText('Use DD/MM/YYYY')).toBeOnTheScreen();
    expect(screen.getByText('Select your nationality')).toBeOnTheScreen();
    expect(screen.getAllByText(kycContent.documentRequired)).toHaveLength(3);
    expect(router.push).not.toHaveBeenCalled();
  });
});
