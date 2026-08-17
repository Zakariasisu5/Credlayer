/**
 * CredLayer Credentials Types
 * These types define the structure of verifiable credentials
 */

export type CredentialStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED' | 'PENDING';
export type CredentialType = 'REPUTATION' | 'TRUST' | 'VERIFICATION' | 'ACHIEVEMENT' | 'CUSTOM';

export interface Credential {
  id: string;
  wallet: string;
  name: string;
  type: CredentialType;
  issuer: string;
  issuer_name?: string;
  status: CredentialStatus;
  issued_at: string;
  expires_at?: string;
  metadata?: Record<string, any>;
  attestation_id?: string;
  transaction_id?: string;
  blockchain?: string;
  verified: boolean;
}

export interface CredentialVerification {
  credential_id: string;
  valid: boolean;
  issuer_valid: boolean;
  not_expired: boolean;
  not_revoked: boolean;
  blockchain_verified: boolean;
  verification_timestamp: string;
  transaction_id?: string;
}

export interface CredentialRequest {
  wallet: string;
  type?: CredentialType;
  status?: CredentialStatus;
  limit?: number;
  offset?: number;
}

export interface CredentialList {
  credentials: Credential[];
  total: number;
  limit: number;
  offset: number;
}
