/**
 * Hooks for webhook management (Developer Portal)
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
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
async function registerWebhook(data: RegisterWebhookRequest): Promise<Webhook> {
  const response = await apiClient.post<ApiEnvelope<Webhook>>('/webhooks', data);
  return unwrap(response.data);
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
async function deleteWebhook(webhookId: string): Promise<{ deleted: boolean; webhookId: string }> {
  const response = await apiClient.delete<ApiEnvelope<{ deleted: boolean; webhookId: string }>>(`/webhooks/${webhookId}`);
  return unwrap(response.data);
}

/**
 * Hook to register a webhook
 */
export function useRegisterWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerWebhook,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['webhooks', data.ownerWallet] });
    },
  });
}

/**
 * Hook to list webhooks for a wallet
 */
export function useWebhooks(ownerWallet: string | null | undefined): UseQueryResult<Webhook[], Error> {
  return useQuery({
    queryKey: ['webhooks', ownerWallet],
    queryFn: () => fetchWebhooks(ownerWallet!),
    enabled: !!ownerWallet,
  });
}

/**
 * Hook to delete a webhook
 */
export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteWebhook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });
}
