import { saveAuthTokens } from '@/lib/auth-token-store';

import { KycUploadError, submitKycWithDocument } from './kyc-api';

function jsonResponse(status: number, body: unknown) {
  return { ok: status >= 200 && status < 300, status, json: async () => body } as Response;
}

const fetchMock = jest.fn();

const DOCUMENT = {
  uri: 'file:///cache/nic.jpg',
  name: 'nic.jpg',
  mimeType: 'image/jpeg',
  size: 2048,
};
const DETAILS = { fullName: 'Jane Doe', nicNumber: '199012345678', dateOfBirth: '1995-03-15' };
const BLOB = { size: 2048 } as Blob;

describe('submitKycWithDocument', () => {
  beforeEach(async () => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    await saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' });
  });

  it('gets an upload URL, uploads the file, then submits with its storage path', async () => {
    fetchMock
      .mockResolvedValueOnce({ blob: async () => BLOB })
      .mockResolvedValueOnce(
        jsonResponse(200, {
          uploadUrl: 'https://storage.example.com/u',
          objectKey: 'kyc/u1/nic.jpg',
          expiresIn: 300,
        }),
      )
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce(jsonResponse(201, { id: 'kyc-1', state: 'PENDING' }));

    await expect(submitKycWithDocument(DETAILS, DOCUMENT)).resolves.toMatchObject({
      state: 'PENDING',
    });

    const [, uploadUrlCall, putCall, submitCall] = fetchMock.mock.calls as [
      unknown,
      [string, RequestInit],
      [string, RequestInit],
      [string, RequestInit],
    ];

    expect(uploadUrlCall[0]).toBe('http://localhost:8000/api/v1/kyc/upload-url');
    expect(JSON.parse(String(uploadUrlCall[1].body))).toEqual({
      contentType: 'image/jpeg',
      sizeBytes: 2048,
    });

    expect(putCall[0]).toBe('https://storage.example.com/u');
    expect(putCall[1]).toMatchObject({ method: 'PUT', body: BLOB });
    expect(putCall[1].headers).not.toHaveProperty('Authorization');

    expect(submitCall[0]).toBe('http://localhost:8000/api/v1/kyc');
    expect(JSON.parse(String(submitCall[1].body))).toEqual({
      ...DETAILS,
      documentPath: 'kyc/u1/nic.jpg',
    });
  });

  it('does not submit when the storage upload fails', async () => {
    fetchMock
      .mockResolvedValueOnce({ blob: async () => BLOB })
      .mockResolvedValueOnce(
        jsonResponse(200, {
          uploadUrl: 'https://storage.example.com/u',
          objectKey: 'k',
          expiresIn: 1,
        }),
      )
      .mockResolvedValueOnce({ ok: false, status: 403 });

    await expect(submitKycWithDocument(DETAILS, DOCUMENT)).rejects.toBeInstanceOf(KycUploadError);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });
});
