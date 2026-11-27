import { router } from 'expo-router';

import { ApiError } from '@/lib/api-client';
import { useAppStore } from '@/store/app-store';
import { fireEvent, renderWithProviders, screen, waitFor } from '@/test/render';

import KycScreen from './KycScreen';
import { kycContent } from './constants';
import { KycUploadError, submitKycWithDocument } from './kyc-api';
import { pickDocument } from './pick-document';

jest.mock('./pick-document', () => ({ pickDocument: jest.fn() }));
jest.mock('./kyc-api', () => ({
  ...jest.requireActual('./kyc-api'),
  submitKycWithDocument: jest.fn(),
}));

const NIC_DOCUMENT = {
  uri: 'file:///cache/nic.jpg',
  name: 'nic.jpg',
  mimeType: 'image/jpeg',
  size: 1024,
};

const SUBMISSION = {
  id: 'kyc-1',
  state: 'PENDING' as const,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

async function fillValidForm() {
  jest.mocked(pickDocument).mockResolvedValue({ document: NIC_DOCUMENT });

  await fireEvent.changeText(screen.getByLabelText(kycContent.fullNameLabel), ' Jane Doe ');
  await fireEvent.changeText(screen.getByLabelText(kycContent.nicLabel), '199012345678');
  await fireEvent.changeText(screen.getByLabelText(kycContent.dateOfBirthLabel), '15031995');
  await fireEvent.press(screen.getByRole('button', { name: `${kycContent.browse} NIC ID` }));
  await screen.findByText('nic.jpg');
}

describe('KycScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAppStore.getState().reset();
    useAppStore.getState().setUser({ userId: 'user-1', email: 'name@example.com' });
  });

  it('shows what is missing and stays on the screen when submitted empty', async () => {
    await renderWithProviders(<KycScreen />);

    const submit = screen.getByRole('button', { name: kycContent.submit });
    expect(submit).toBeEnabled();

    await fireEvent.press(submit);

    expect(screen.getByText('Full legal name is required')).toBeOnTheScreen();
    expect(screen.getByText('Enter a valid Sri Lankan NIC number')).toBeOnTheScreen();
    expect(screen.getByText('Use DD/MM/YYYY')).toBeOnTheScreen();
    expect(screen.getAllByText(kycContent.documentRequired)).toHaveLength(1);
    expect(submitKycWithDocument).not.toHaveBeenCalled();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('submits the details with the NIC document and moves on to the smart meter', async () => {
    jest.mocked(submitKycWithDocument).mockResolvedValue(SUBMISSION);
    await renderWithProviders(<KycScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: kycContent.submit }));

    await waitFor(() => expect(router.push).toHaveBeenCalledWith('/smart-meter'));
    expect(submitKycWithDocument).toHaveBeenCalledWith(
      { fullName: 'Jane Doe', nicNumber: '199012345678', dateOfBirth: '1995-03-15' },
      NIC_DOCUMENT,
    );
    expect(useAppStore.getState().user?.kycStatus).toBe('PENDING');
  });

  it('shows an upload error and stays on the screen', async () => {
    jest.mocked(submitKycWithDocument).mockRejectedValue(new KycUploadError());
    await renderWithProviders(<KycScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: kycContent.submit }));

    expect(await screen.findByText(kycContent.uploadError)).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('shows the gateway message when the details are rejected', async () => {
    jest
      .mocked(submitKycWithDocument)
      .mockRejectedValue(new ApiError('VALIDATION_ERROR', 'NIC number is not valid.', 400));
    await renderWithProviders(<KycScreen />);

    await fillValidForm();
    await fireEvent.press(screen.getByRole('button', { name: kycContent.submit }));

    expect(await screen.findByText('NIC number is not valid.')).toBeOnTheScreen();
    expect(router.push).not.toHaveBeenCalled();
  });

  it('lets the user skip for now', async () => {
    await renderWithProviders(<KycScreen />);

    await fireEvent.press(screen.getByText(kycContent.skip));

    expect(router.push).toHaveBeenCalledWith('/smart-meter');
  });

  it('can be opened again after a rejection', async () => {
    useAppStore.getState().setUser({ userId: 'user-1', email: 'a@b.c', kycStatus: 'REJECTED' });
    await renderWithProviders(<KycScreen />);

    expect(screen.getByRole('button', { name: kycContent.submit })).toBeOnTheScreen();
  });

  it.each(['PENDING', 'VERIFIED'] as const)(
    'does not show the form when KYC is already %s',
    async (kycStatus) => {
      useAppStore.getState().setUser({ userId: 'user-1', email: 'a@b.c', kycStatus });
      await renderWithProviders(<KycScreen />);

      expect(screen.queryByRole('button', { name: kycContent.submit })).toBeNull();
    },
  );
});
