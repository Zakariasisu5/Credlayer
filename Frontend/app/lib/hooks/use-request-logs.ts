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

export interface RequestLogStats {
  totalRequests: number;
  successful: number;
  errors: number;
  unauthorized: number;
  rateLimited: number;
}

async function fetchRequestLogs(ownerWallet: string, limit = 100): Promise<RequestLog[]> {
  const response = await apiClient.get<ApiEnvelope<RequestLog[]>>('/developer/requests', {
    params: { owner_wallet: ownerWallet, limit },
  });
  return unwrap(response.data);
}

async function fetchRequestLogStats(ownerWallet: string): Promise<RequestLogStats> {
  const response = await apiClient.get<ApiEnvelope<RequestLogStats>>(
    `/request-logs/stats/${encodeURIComponent(ownerWallet)}`,
  );
  return unwrap(response.data);
}

export function useRequestLogs(ownerWallet: string | null | undefined, limit = 100) {
  return useSWR(
    ownerWallet ? `/developer/requests?owner_wallet=${ownerWallet}&limit=${limit}` : null,
    () => fetchRequestLogs(ownerWallet!, limit),
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
    },
  );
}

export function useRequestLogStats(ownerWallet: string | null | undefined) {
  const key = ownerWallet
    ? `/request-logs/stats/${encodeURIComponent(ownerWallet)}`
    : null;

  return useSWR(key, () => fetchRequestLogStats(ownerWallet!), {
    refreshInterval: 15000,
    revalidateOnFocus: true,
    keepPreviousData: true,
  });
}

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
