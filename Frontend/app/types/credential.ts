export interface Credential {
  id: string;
  issuer: string;
  holder: string;
  type: CredentialType;
  status: CredentialStatus;
  issuedAt: string;
  expiresAt?: string;
  verifiedAt?: string;
  revokedAt?: string;
  metadata: CredentialMetadata;
  proof: CredentialProof;
  chain: string;
  transactionHash?: string;
}

export type CredentialType = 
  | 'identity'
  | 'reputation'
  | 'achievement'
  | 'certification'
  | 'membership'
  | 'kyc'
  | 'accreditation'
  | 'attestation';

export type CredentialStatus = 'active' | 'expired' | 'revoked' | 'pending';

export interface CredentialMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  attributes?: Record<string, string | number | boolean>;
  tags?: string[];
}

export interface CredentialProof {
  type: 'eip712' | 'zkp' | 'signature';
  signature: string;
  signedBy: string;
  signedAt: string;
  verificationMethod?: string;
}

export interface IssueCredentialRequest {
  holder: string;
  type: CredentialType;
  metadata: CredentialMetadata;
  expiresAt?: string;
  chain?: string;
}

export interface VerifyCredentialRequest {
  credentialId: string;
  signature?: string;
  proof?: Partial<CredentialProof>;
}

export interface RevokeCredentialRequest {
  credentialId: string;
  reason: string;
}
