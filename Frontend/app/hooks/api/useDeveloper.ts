import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { developerApi } from '@/services/api';
import type { CreateAPIKeyRequest, CreateWebhookRequest } from '@/types/developer';

// Query Keys
export const developerKeys = {
  all: ['developer'] as const,
  apiKeys: () => [...developerKeys.all, 'keys'] as const,
  usage: (timeRange: string) => [...developerKeys.all, 'usage', timeRange] as const,
  requests: (page?: number) => [...developerKeys.all, 'requests', page] as const,
  webhooks: () => [...developerKeys.all, 'webhooks'] as const,
  webhook: (id: string) => [...developerKeys.webhooks(), id] as const,
  deliveries: (webhookId: string, page?: number) => 
    [...developerKeys.webhook(webhookId), 'deliveries', page] as const,
};

// API Keys Hooks
export function useAPIKeys() {
  return useQuery({
    queryKey: developerKeys.apiKeys(),
    queryFn: () => developerApi.getAPIKeys(),
  });
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAPIKeyRequest) => developerApi.createAPIKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.apiKeys() });
    },
  });
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (keyId: string) => developerApi.revokeAPIKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.apiKeys() });
    },
  });
}

// Usage Stats Hooks
export function useUsageStats(timeRange: '24h' | '7d' | '30d' = '24h') {
  return useQuery({
    queryKey: developerKeys.usage(timeRange),
    queryFn: () => developerApi.getUsageStats(timeRange),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useRecentRequests(page?: number) {
  return useQuery({
    queryKey: developerKeys.requests(page),
    queryFn: () => developerApi.getRecentRequests({ page }),
    staleTime: 30 * 1000, // 30 seconds
  });
}

// Webhooks Hooks
export function useWebhooks() {
  return useQuery({
    queryKey: developerKeys.webhooks(),
    queryFn: () => developerApi.getWebhooks(),
  });
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateWebhookRequest) => developerApi.createWebhook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.webhooks() });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (webhookId: string) => developerApi.deleteWebhook(webhookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: developerKeys.webhooks() });
    },
  });
}

export function useWebhookDeliveries(webhookId: string, page?: number) {
  return useQuery({
    queryKey: developerKeys.deliveries(webhookId, page),
    queryFn: () => developerApi.getWebhookDeliveries(webhookId, { page }),
    enabled: !!webhookId,
  });
}
