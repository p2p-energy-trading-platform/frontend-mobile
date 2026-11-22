export type SignInValues = {
  email: string;
  password: string;
};

export type SignInErrors = {
  email?: string;
  password?: string;
};

export type SignUpValues = {
  email: string;
  password: string;
  confirmation: string;
  accepted: boolean;
};

export type SignUpErrors = {
  email?: string;
  password?: string;
  confirmation?: string;
  terms?: string;
};

export type KycDocumentKey = 'idFront' | 'idBack' | 'selfie';

/** A file the user picked for one of the KYC documents. */
export type PickedDocument = {
  uri: string;
  name: string;
  mimeType: string;
  /** Size in bytes, when the picker could read it. */
  size?: number;
};

export type KycDocuments = Partial<Record<KycDocumentKey, PickedDocument>>;

export type KycValues = {
  fullName: string;
  nic: string;
  dateOfBirth: string;
  nationality: string;
  documents: KycDocuments;
};

export type KycErrors = {
  fullName?: string;
  nic?: string;
  dateOfBirth?: string;
  nationality?: string;
  documents?: string;
};

export type MeterType = 'advanced' | 'standard';

export type SmartMeterValues = {
  serial: string;
  zone: string;
};

export type SmartMeterErrors = {
  serial?: string;
  zone?: string;
};
