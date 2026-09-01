/**
 * Hook for fetching trust connections
 */

import useSWR from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface Connection {
  id: string;
  sourceWallet: string;
  targetWallet: string;
  connectionType: string;
  strength: number;
  verified: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface ConnectionsResponse {
  wallet: string;
  connections: Connection[];
  totalCount: number;
  graphData?: Record<string, unknown>;
}

/**
 * Fetch connections for a wallet
 */
async function fetchConnections(wallet: string): Promise<ConnectionsResponse> {
  const response = await apiClient.get<ApiEnvelope<ConnectionsResponse>>(`/connections/${wallet}`);
  return unwrap(response.data);
}

/**
 * Hook to get connections for a wallet
 */
export function useConnections(wallet: string | null | undefined) {
  return useSWR(
    wallet ? `/connections/${wallet}` : null,
    () => fetchConnections(wallet!),
    {
      refreshInterval: 60000, // 1 minute
      revalidateOnFocus: false,
    }
  );
}
