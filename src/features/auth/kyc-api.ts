import { apiRequest } from '@/lib/api-client';

import type { PickedDocument } from './types';

export type KycState = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type KycUploadUrl = {
  uploadUrl: string;
  objectKey: string;
  expiresIn: number;
};

export type KycSubmitRequest = {
  fullName: string;
  /** YYYY-MM-DD */
  dateOfBirth: string;
  nicNumber: string;
  documentPath: string;
};

export type KycSubmission = {
  id: string;
  state: KycState;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
};

export class KycUploadError extends Error {
  constructor() {
    super('KYC document upload failed');
    this.name = 'KycUploadError';
  }
}

export function createKycUploadUrl(contentType: string, sizeBytes: number) {
  return apiRequest<KycUploadUrl>('/api/v1/kyc/upload-url', {
    method: 'POST',
    body: { contentType, sizeBytes },
  });
}

export async function readDocument(document: PickedDocument): Promise<Blob> {
  try {
    return await (await fetch(document.uri)).blob();
  } catch {
    throw new KycUploadError();
  }
}

// Presigned storage URL, not the gateway, so no auth header.
export async function uploadKycDocument(uploadUrl: string, file: Blob, contentType: string) {
  let response: Response;

  try {
    response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': contentType },
    });
  } catch {
    throw new KycUploadError();
  }

  if (!response.ok) throw new KycUploadError();
}

export function submitKyc(request: KycSubmitRequest) {
  return apiRequest<KycSubmission>('/api/v1/kyc', { method: 'POST', body: request });
}

export async function submitKycWithDocument(
  details: Omit<KycSubmitRequest, 'documentPath'>,
  document: PickedDocument,
): Promise<KycSubmission> {
  const file = await readDocument(document);
  const { uploadUrl, objectKey } = await createKycUploadUrl(
    document.mimeType,
    document.size || file.size,
  );

  await uploadKycDocument(uploadUrl, file, document.mimeType);

  return submitKyc({ ...details, documentPath: objectKey });
}
