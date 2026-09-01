/**
 * Hook for fetching credentials
 */

import useSWR, { mutate } from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface Credential {
  id: string;
  walletAddress: string;
  credentialType: string;
  issuer: string;
  status: 'active' | 'revoked' | 'expired' | 'pending';
  verificationStatus: 'verified' | 'failed' | 'pending' | 'unverified';
  metadata: Record<string, unknown>;
  issuedAt: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
}

/**
 * Fetch credentials for a wallet
 */
async function fetchCredentials(wallet: string): Promise<Credential[]> {
  const response = await apiClient.get<ApiEnvelope<Credential[]>>(`/credentials/${wallet}`);
  return unwrap(response.data);
}

/**
 * Trigger re-verification of a credential
 */
export async function reverifyCredential(credentialId: string, walletAddress: string): Promise<Credential> {
  const response = await apiClient.post<ApiEnvelope<Credential>>(`/credentials/${credentialId}/verify`);
  const result = unwrap(response.data);
  // Revalidate credentials after mutation
  mutate(`/credentials/${walletAddress}`);
  return result;
}

/**
 * Hook to get credentials for a wallet
 */
export function useCredentials(wallet: string | null | undefined) {
  return useSWR(
    wallet ? `/credentials/${wallet}` : null,
    () => fetchCredentials(wallet!),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: false,
    }
  );
}
