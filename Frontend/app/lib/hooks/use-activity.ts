/**
 * Hook for fetching activity feed
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface ActivityEvent {
  id: string;
  walletAddress: string;
  eventType: string;
  eventCategory: 'signal' | 'credential' | 'connection' | 'score' | 'system';
  title: string;
  description?: string;
  status: 'success' | 'pending' | 'failed' | 'error';
  metadata?: Record<string, unknown>;
  errorDetails?: Record<string, unknown>;
  createdAt: string;
}

/**
 * Fetch activity feed for a wallet
 */
async function fetchActivity(wallet: string, limit = 100): Promise<ActivityEvent[]> {
  const response = await apiClient.get<ApiEnvelope<ActivityEvent[]>>(`/activity/${wallet}`, {
    params: { limit },
  });
  return unwrap(response.data);
}

/**
 * Hook to get activity feed for a wallet
 */
export function useActivity(
  wallet: string | null | undefined,
  limit = 100
): UseQueryResult<ActivityEvent[], Error> {
  return useQuery({
    queryKey: ['activity', wallet, limit],
    queryFn: () => fetchActivity(wallet!, limit),
    enabled: !!wallet,
    staleTime: 30000, // 30 seconds
  });
}
