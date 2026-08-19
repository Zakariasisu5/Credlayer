/**
 * CredLayer Developer API
 * Endpoints for developer platform features
 */

import { apiClient } from './client';
import type {
  ApiKey,
  ApiKeyCreate,
  ApiKeyResponse,
  Project,
  ApiUsage,
  ApiUsageStats,
  Webhook,
  WebhookCreate,
} from '@/types/developer';

// API Keys
export async function getApiKeys(): Promise<ApiKey[]> {
  return apiClient.get<ApiKey[]>('/developer/api-keys');
}

export async function createApiKey(
  data: ApiKeyCreate
): Promise<ApiKeyResponse> {
  return apiClient.post<ApiKeyResponse>('/developer/api-keys', data);
}

export async function revokeApiKey(id: string): Promise<void> {
  return apiClient.delete(`/developer/api-keys/${id}`);
}

// Projects
export async function getProjects(): Promise<Project[]> {
  return apiClient.get<Project[]>('/developer/projects');
}

export async function createProject(data: {
  name: string;
  description?: string;
}): Promise<Project> {
  return apiClient.post<Project>('/developer/projects', data);
}

export async function deleteProject(id: string): Promise<void> {
  return apiClient.delete(`/developer/projects/${id}`);
}

// Usage Statistics
export async function getApiUsage(): Promise<ApiUsage> {
  return apiClient.get<ApiUsage>('/developer/usage');
}

export async function getApiUsageStats(
  period: 'day' | 'week' | 'month' = 'week'
): Promise<ApiUsageStats> {
  return apiClient.get<ApiUsageStats>('/developer/usage/stats', {
    params: { period },
  });
}

// Webhooks
export async function getWebhooks(): Promise<Webhook[]> {
  return apiClient.get<Webhook[]>('/developer/webhooks');
}

export async function createWebhook(data: WebhookCreate): Promise<Webhook> {
  return apiClient.post<Webhook>('/developer/webhooks', data);
}

export async function deleteWebhook(id: string): Promise<void> {
  return apiClient.delete(`/developer/webhooks/${id}`);
}

export async function testWebhook(id: string): Promise<void> {
  return apiClient.post(`/developer/webhooks/${id}/test`);
}
