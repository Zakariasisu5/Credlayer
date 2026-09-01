/**
 * Hook for developer request logs (Developer Portal)
 */

import useSWR from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export type RequestStatus = 'success' | 'error' | 'unauthorized' | 'rate_limited' | 'invalid';

export interface RequestLog {
  id: string;
  apiKeyId?: string;
  ownerWallet: string;
  method: string;
  endpoint: string;
  statusCode: number;
  requestHeaders?: Record<string, unknown>;
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  errorMessage?: string;
  durationMs?: number;
  ipAddress?: string;
  createdAt: string;
}

/**
 * Fetch request logs for a wallet
 */
async function fetchRequestLogs(ownerWallet: string, limit = 100): Promise<RequestLog[]> {
  const response = await apiClient.get<ApiEnvelope<RequestLog[]>>('/developer/requests', {
    params: { owner_wallet: ownerWallet, limit },
  });
  return unwrap(response.data);
}

/**
 * Hook to get request logs for a wallet
 */
export function useRequestLogs(
  ownerWallet: string | null | undefined,
  limit = 100
) {
  return useSWR(
    ownerWallet ? `/developer/requests?owner_wallet=${ownerWallet}&limit=${limit}` : null,
    () => fetchRequestLogs(ownerWallet!, limit),
    {
      refreshInterval: 10000, // 10 seconds
      revalidateOnFocus: true,
    }
  );
}

/**
 * Derive status from status code
 */
export function getRequestStatus(statusCode: number): RequestStatus {
  if (statusCode === 401 || statusCode === 403) {
    return 'unauthorized';
  } else if (statusCode === 429) {
    return 'rate_limited';
  } else if (statusCode >= 400 && statusCode < 500) {
    return 'invalid';
  } else if (statusCode >= 500) {
    return 'error';
  } else {
    return 'success';
  }
}
