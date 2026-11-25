import * as DocumentPicker from 'expo-document-picker';

import { KYC_ALLOWED_MIME_TYPES, kycContent } from './constants';
import type { PickDocumentResult } from './types';

export async function pickDocument(): Promise<PickDocumentResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [...KYC_ALLOWED_MIME_TYPES],
      copyToCacheDirectory: true,
      multiple: false,
    });

    const asset = result.canceled ? undefined : result.assets[0];
    if (!asset) return {};

    return {
      document: {
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? '',
        size: asset.size,
      },
    };
  } catch {
    return { error: kycContent.pickerError };
  }
}
