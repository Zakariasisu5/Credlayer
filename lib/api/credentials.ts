/**
 * CredLayer Credentials API
 * Endpoints for verifiable credentials
 */

import { apiClient } from './client';
import type {
  Credential,
  CredentialVerification,
  CredentialRequest,
  CredentialList,
} from '@/types/credentials';

/**
 * Get credentials for a wallet
 */
export async function getCredentials(
  request: CredentialRequest
): Promise<CredentialList> {
  const { wallet, ...params } = request;
  return apiClient.get<CredentialList>(`/credentials/${wallet}`, { params });
}

/**
 * Get a specific credential by ID
 */
export async function getCredentialById(id: string): Promise<Credential> {
  return apiClient.get<Credential>(`/credentials/${id}`);
}

/**
 * Verify a credential
 * Checks validity, expiration, revocation, and blockchain attestation
 */
export async function verifyCredential(
  id: string
): Promise<CredentialVerification> {
  return apiClient.post<CredentialVerification>(`/credentials/${id}/verify`);
}

/**
 * Request credential issuance
 * This would trigger the credential creation process
 */
export async function requestCredential(data: {
  wallet: string;
  type: string;
  metadata?: Record<string, unknown>;
}) {
  return apiClient.post('/credentials/request', data);
}
