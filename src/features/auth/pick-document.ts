import * as DocumentPicker from 'expo-document-picker';

import { KYC_ALLOWED_MIME_TYPES } from './constants';
import type { PickedDocument } from './types';

/** Opens the system file picker. Resolves to undefined when the user cancels. */
export async function pickDocument(): Promise<PickedDocument | undefined> {
  const result = await DocumentPicker.getDocumentAsync({
    type: [...KYC_ALLOWED_MIME_TYPES],
    copyToCacheDirectory: true,
    multiple: false,
  });

  const asset = result.canceled ? undefined : result.assets[0];
  if (!asset) return undefined;

  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType ?? '',
    size: asset.size,
  };
}
