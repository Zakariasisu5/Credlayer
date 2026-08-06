export interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: 'production' | 'development' | 'staging';
  status: 'active' | 'revoked' | 'expired';
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  permissions: APIPermission[];
  usage: APIKeyUsage;
}

export type APIPermission = 
  | 'read:reputation'
  | 'write:reputation'
  | 'read:credentials'
  | 'write:credentials'
  | 'read:analytics'
  | 'read:webhooks'
  | 'write:webhooks'
  | 'admin:*';

export interface APIKeyUsage {
  totalRequests: number;
  lastHour: number;
  lastDay: number;
  lastMonth: number;
}

export interface CreateAPIKeyRequest {
  name: string;
  environment: 'production' | 'development' | 'staging';
  permissions: APIPermission[];
  expiresAt?: string;
}

export interface APIUsageStats {
  timeRange: '24h' | '7d' | '30d';
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: EndpointUsage[];
  requestsByStatus: Record<number, number>;
  rateLimit: RateLimitInfo;
}

export interface EndpointUsage {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requests: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: string;
  period: string;
}

export interface RecentAPIRequest {
  id: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  status: 'active' | 'inactive' | 'failed';
  secret: string;
  createdAt: string;
  lastTriggeredAt?: string;
  failureCount: number;
  retryPolicy: WebhookRetryPolicy;
}

export type WebhookEvent = 
  | 'reputation.updated'
  | 'credential.issued'
  | 'credential.verified'
  | 'credential.revoked'
  | 'badge.earned'
  | 'risk.alert';

export interface WebhookRetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number;
}

export interface CreateWebhookRequest {
  url: string;
  events: WebhookEvent[];
  secret?: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: Record<string, unknown>;
  status: 'success' | 'failed' | 'pending' | 'retrying';
  attempts: number;
  sentAt: string;
  responseCode?: number;
  responseBody?: string;
  error?: string;
}
