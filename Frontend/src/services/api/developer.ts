import api from './client';
import type { PaginationParams, PaginatedResponse } from '@/types/api';
import type {
  APIKey,
  CreateAPIKeyRequest,
  APIUsageStats,
  RecentAPIRequest,
  Webhook,
  CreateWebhookRequest,
  WebhookDelivery,
} from '@/types/developer';

export const developerApi = {
  // API Keys
  getAPIKeys: async () => {
    return api.get<APIKey[]>('/developer/keys');
  },

  createAPIKey: async (data: CreateAPIKeyRequest) => {
    return api.post<APIKey>('/developer/keys', data);
  },

  revokeAPIKey: async (keyId: string) => {
    return api.delete<void>(`/developer/keys/${keyId}`);
  },

  rotateAPIKey: async (keyId: string) => {
    return api.post<APIKey>(`/developer/keys/${keyId}/rotate`);
  },

  // Usage Stats
  getUsageStats: async (timeRange: '24h' | '7d' | '30d' = '24h') => {
    return api.get<APIUsageStats>('/developer/usage', { params: { timeRange } });
  },

  getRecentRequests: async (params?: PaginationParams) => {
    return api.get<PaginatedResponse<RecentAPIRequest>>('/developer/requests', { params });
  },

  // Webhooks
  getWebhooks: async () => {
    return api.get<Webhook[]>('/developer/webhooks');
  },

  createWebhook: async (data: CreateWebhookRequest) => {
    return api.post<Webhook>('/developer/webhooks', data);
  },

  updateWebhook: async (webhookId: string, data: Partial<CreateWebhookRequest>) => {
    return api.patch<Webhook>(`/developer/webhooks/${webhookId}`, data);
  },

  deleteWebhook: async (webhookId: string) => {
    return api.delete<void>(`/developer/webhooks/${webhookId}`);
  },

  testWebhook: async (webhookId: string) => {
    return api.post<{ success: boolean }>(`/developer/webhooks/${webhookId}/test`);
  },

  getWebhookDeliveries: async (webhookId: string, params?: PaginationParams) => {
    return api.get<PaginatedResponse<WebhookDelivery>>(
      `/developer/webhooks/${webhookId}/deliveries`,
      { params }
    );
  },

  retryWebhookDelivery: async (webhookId: string, deliveryId: string) => {
    return api.post<void>(`/developer/webhooks/${webhookId}/deliveries/${deliveryId}/retry`);
  },
};
