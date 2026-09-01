/**
 * Hooks for API key management (Developer Portal)
 */

import useSWR, { mutate } from 'swr';
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
export async function createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyWithSecret> {
  const response = await apiClient.post<ApiEnvelope<ApiKeyWithSecret>>('/api-keys', data);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/api-keys?owner_wallet=${data.ownerWallet}`);
  return result;
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
export async function revokeApiKey(keyId: string, ownerWallet: string): Promise<{ revoked: boolean; keyId: string }> {
  const response = await apiClient.delete<ApiEnvelope<{ revoked: boolean; keyId: string }>>(`/api-keys/${keyId}`);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/api-keys?owner_wallet=${ownerWallet}`);
  return result;
}

/**
 * Hook to list API keys for a wallet
 */
export function useApiKeys(ownerWallet: string | null | undefined) {
  return useSWR(
    ownerWallet ? `/api-keys?owner_wallet=${ownerWallet}` : null,
    () => fetchApiKeys(ownerWallet!),
    {
      revalidateOnFocus: false,
    }
  );
}
