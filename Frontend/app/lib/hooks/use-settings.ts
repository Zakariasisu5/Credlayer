/**
 * Hooks for user settings
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
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
async function updateSettings(wallet: string, data: UpdateSettingsRequest): Promise<Settings> {
  const response = await apiClient.put<ApiEnvelope<Settings>>(`/settings/${wallet}`, data);
  return unwrap(response.data);
}

/**
 * Hook to get settings for a wallet
 */
export function useSettings(wallet: string | null | undefined): UseQueryResult<Settings, Error> {
  return useQuery({
    queryKey: ['settings', wallet],
    queryFn: () => fetchSettings(wallet!),
    enabled: !!wallet,
  });
}

/**
 * Hook to update settings
 */
export function useUpdateSettings(wallet: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSettingsRequest) => updateSettings(wallet, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings', wallet] });
    },
  });
}
