/**
 * CredLayer Developer Platform Types
 * These types define the structure of developer API data
 */

export type ApiKeyStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';
export type ProjectStatus = 'ACTIVE' | 'SUSPENDED' | 'DELETED';

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string; // e.g., "sk_live_"
  status: ApiKeyStatus;
  created_at: string;
  last_used_at?: string;
  expires_at?: string;
  project_id?: string;
  permissions: string[];
}

export interface ApiKeyCreate {
  name: string;
  project_id?: string;
  permissions?: string[];
  expires_in_days?: number;
}

export interface ApiKeyResponse {
  id: string;
  key: string; // Full key only shown once
  name: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  created_at: string;
  api_keys_count: number;
  requests_count: number;
}

export interface ApiUsage {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  error_rate: number;
  requests_by_endpoint: Record<string, number>;
  requests_by_date: Array<{
    date: string;
    count: number;
  }>;
  rate_limit_remaining: number;
  rate_limit_reset: string;
}

export interface ApiUsageStats {
  period: 'day' | 'week' | 'month';
  total_requests: number;
  successful: number;
  errors: number;
  avg_response_time: number;
  top_endpoints: Array<{
    endpoint: string;
    count: number;
  }>;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'ACTIVE' | 'INACTIVE';
  secret: string;
  created_at: string;
  last_triggered_at?: string;
}

export interface WebhookCreate {
  url: string;
  events: string[];
  secret?: string;
}
