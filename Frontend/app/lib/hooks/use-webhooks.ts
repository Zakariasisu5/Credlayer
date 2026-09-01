/**
 * Hooks for webhook management (Developer Portal)
 */

import useSWR, { mutate } from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export type EventType = 'score_change' | 'credential_verified' | 'risk_flag' | 'connection_added';

export interface Webhook {
  id: string;
  ownerWallet: string;
  url: string;
  eventTypes: string[];
  isActive: boolean;
  secret?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterWebhookRequest {
  ownerWallet: string;
  url: string;
  eventTypes: EventType[];
  secret?: string;
}

/**
 * Register a new webhook
 */
export async function registerWebhook(data: RegisterWebhookRequest): Promise<Webhook> {
  const response = await apiClient.post<ApiEnvelope<Webhook>>('/webhooks', data);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/webhooks?owner_wallet=${data.ownerWallet}`);
  return result;
}

/**
 * Fetch all webhooks for a wallet
 */
async function fetchWebhooks(ownerWallet: string): Promise<Webhook[]> {
  const response = await apiClient.get<ApiEnvelope<Webhook[]>>('/webhooks', {
    params: { owner_wallet: ownerWallet },
  });
  return unwrap(response.data);
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(webhookId: string, ownerWallet: string): Promise<{ deleted: boolean; webhookId: string }> {
  const response = await apiClient.delete<ApiEnvelope<{ deleted: boolean; webhookId: string }>>(`/webhooks/${webhookId}`);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/webhooks?owner_wallet=${ownerWallet}`);
  return result;
}

/**
 * Hook to list webhooks for a wallet
 */
export function useWebhooks(ownerWallet: string | null | undefined) {
  return useSWR(
    ownerWallet ? `/webhooks?owner_wallet=${ownerWallet}` : null,
    () => fetchWebhooks(ownerWallet!),
    {
      revalidateOnFocus: false,
    }
  );
}
