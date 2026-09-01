/**
 * Hooks for user settings
 */

import useSWR, { mutate } from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface Settings {
  id: string;
  walletAddress: string;
  preferences: Record<string, unknown>;
  notifications: {
    email: boolean;
    push: boolean;
    webhook: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showConnections: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  preferences?: Record<string, unknown>;
  notifications?: {
    email?: boolean;
    push?: boolean;
    webhook?: boolean;
  };
  privacy?: {
    publicProfile?: boolean;
    showConnections?: boolean;
  };
}

/**
 * Fetch settings for a wallet
 */
async function fetchSettings(wallet: string): Promise<Settings> {
  const response = await apiClient.get<ApiEnvelope<Settings>>(`/settings/${wallet}`);
  return unwrap(response.data);
}

/**
 * Update settings for a wallet
 */
export async function updateSettings(wallet: string, data: UpdateSettingsRequest): Promise<Settings> {
  const response = await apiClient.put<ApiEnvelope<Settings>>(`/settings/${wallet}`, data);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/settings/${wallet}`);
  return result;
}

/**
 * Hook to get settings for a wallet
 */
export function useSettings(wallet: string | null | undefined) {
  return useSWR(
    wallet ? `/settings/${wallet}` : null,
    () => fetchSettings(wallet!),
    {
      revalidateOnFocus: false,
    }
  );
}
