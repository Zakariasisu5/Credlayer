/**
 * Hooks for API key management (Developer Portal)
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface ApiKey {
  id: string;
  keyPrefix: string;
  ownerWallet: string;
  name: string;
  isActive: boolean;
  permissions?: Record<string, unknown>;
  lastUsedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  key: string; // Full key, only returned on creation
}

export interface CreateApiKeyRequest {
  ownerWallet: string;
  name: string;
  permissions?: Record<string, unknown>;
}

/**
 * Create a new API key
 */
async function createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyWithSecret> {
  const response = await apiClient.post<ApiEnvelope<ApiKeyWithSecret>>('/api-keys', data);
  return unwrap(response.data);
}

/**
 * Fetch all API keys for a wallet
 */
async function fetchApiKeys(ownerWallet: string): Promise<ApiKey[]> {
  const response = await apiClient.get<ApiEnvelope<ApiKey[]>>('/api-keys', {
    params: { owner_wallet: ownerWallet },
  });
  return unwrap(response.data);
}

/**
 * Revoke an API key
 */
async function revokeApiKey(keyId: string): Promise<{ revoked: boolean; keyId: string }> {
  const response = await apiClient.delete<ApiEnvelope<{ revoked: boolean; keyId: string }>>(`/api-keys/${keyId}`);
  return unwrap(response.data);
}

/**
 * Hook to create an API key
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createApiKey,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys', data.ownerWallet] });
    },
  });
}

/**
 * Hook to list API keys for a wallet
 */
export function useApiKeys(ownerWallet: string | null | undefined): UseQueryResult<ApiKey[], Error> {
  return useQuery({
    queryKey: ['apiKeys', ownerWallet],
    queryFn: () => fetchApiKeys(ownerWallet!),
    enabled: !!ownerWallet,
  });
}

/**
 * Hook to revoke an API key
 */
export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: revokeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeys'] });
    },
  });
}
