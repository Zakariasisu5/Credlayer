/**
 * Hook for fetching credentials
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
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
async function reverifyCredential(credentialId: string): Promise<Credential> {
  const response = await apiClient.post<ApiEnvelope<Credential>>(`/credentials/${credentialId}/verify`);
  return unwrap(response.data);
}

/**
 * Hook to get credentials for a wallet
 */
export function useCredentials(wallet: string | null | undefined): UseQueryResult<Credential[], Error> {
  return useQuery({
    queryKey: ['credentials', wallet],
    queryFn: () => fetchCredentials(wallet!),
    enabled: !!wallet,
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook to re-verify a credential
 */
export function useReverifyCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: reverifyCredential,
    onSuccess: (data) => {
      // Invalidate credentials query to refetch
      queryClient.invalidateQueries({ queryKey: ['credentials', data.walletAddress] });
    },
  });
}
