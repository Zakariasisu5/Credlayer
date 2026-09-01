/**
 * Hook for fetching trust scores
 */

import useSWR from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface TrustScore {
  address: string;
  score: number;
  confidence: number;
  signals: Array<{
    type: string;
    weight: number;
    verified: boolean;
  }>;
  lastUpdated: string;
  metadata?: Record<string, unknown>;
}

/**
 * Fetch trust score for a wallet address
 */
async function fetchTrustScore(address: string): Promise<TrustScore> {
  const response = await apiClient.get<ApiEnvelope<TrustScore>>(`/scores/${address}`);
  return unwrap(response.data);
}

/**
 * Hook to get trust score for a wallet
 */
export function useTrustScore(address: string | null | undefined) {
  return useSWR(
    address ? `/scores/${address}` : null,
    () => fetchTrustScore(address!),
    {
      refreshInterval: 30000, // 30 seconds
      revalidateOnFocus: false,
    }
  );
}
