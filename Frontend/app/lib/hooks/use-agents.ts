/**
 * Hooks for agent management
 */

import useSWR, { mutate } from 'swr';
import { apiClient, unwrap, type ApiEnvelope } from '../api-client';

export interface Agent {
  id: string;
  agentId: string;
  ownerWallet: string;
  name: string;
  description?: string;
  permissions: Record<string, unknown>;
  status: 'active' | 'suspended' | 'revoked';
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  activityType: string;
  endpoint: string;
  method: string;
  statusCode: number;
  requestData?: Record<string, unknown>;
  responseData?: Record<string, unknown>;
  errorMessage?: string;
  durationMs?: number;
  createdAt: string;
}

export interface RegisterAgentRequest {
  agentId: string;
  ownerWallet: string;
  name: string;
  description?: string;
  permissions: Record<string, unknown>;
}

/**
 * Register a new agent
 */
export async function registerAgent(data: RegisterAgentRequest): Promise<Agent> {
  const response = await apiClient.post<ApiEnvelope<Agent>>('/agents', data);
  const result = unwrap(response.data);
  // Revalidate after mutation
  mutate(`/agents/${result.agentId}`);
  return result;
}

/**
 * Fetch agent details
 */
async function fetchAgent(agentId: string): Promise<Agent> {
  const response = await apiClient.get<ApiEnvelope<Agent>>(`/agents/${agentId}`);
  return unwrap(response.data);
}

/**
 * Fetch agent activity log
 */
async function fetchAgentActivity(agentId: string, limit = 100): Promise<AgentActivity[]> {
  const response = await apiClient.get<ApiEnvelope<AgentActivity[]>>(`/agents/${agentId}/activity`, {
    params: { limit },
  });
  return unwrap(response.data);
}

/**
 * Hook to get agent details
 */
export function useAgent(agentId: string | null | undefined) {
  return useSWR(
    agentId ? `/agents/${agentId}` : null,
    () => fetchAgent(agentId!),
    {
      revalidateOnFocus: false,
    }
  );
}

/**
 * Hook to get agent activity
 */
export function useAgentActivity(
  agentId: string | null | undefined,
  limit = 100
) {
  return useSWR(
    agentId ? `/agents/${agentId}/activity?limit=${limit}` : null,
    () => fetchAgentActivity(agentId!, limit),
    {
      refreshInterval: 10000, // 10 seconds
      revalidateOnFocus: true,
    }
  );
}
