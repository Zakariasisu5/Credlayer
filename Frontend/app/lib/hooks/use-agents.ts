/**
 * Hooks for agent management
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
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
async function registerAgent(data: RegisterAgentRequest): Promise<Agent> {
  const response = await apiClient.post<ApiEnvelope<Agent>>('/agents', data);
  return unwrap(response.data);
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
 * Hook to register an agent
 */
export function useRegisterAgent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: registerAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });
}

/**
 * Hook to get agent details
 */
export function useAgent(agentId: string | null | undefined): UseQueryResult<Agent, Error> {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => fetchAgent(agentId!),
    enabled: !!agentId,
  });
}

/**
 * Hook to get agent activity
 */
export function useAgentActivity(
  agentId: string | null | undefined,
  limit = 100
): UseQueryResult<AgentActivity[], Error> {
  return useQuery({
    queryKey: ['agentActivity', agentId, limit],
    queryFn: () => fetchAgentActivity(agentId!, limit),
    enabled: !!agentId,
    staleTime: 10000, // 10 seconds
  });
}
