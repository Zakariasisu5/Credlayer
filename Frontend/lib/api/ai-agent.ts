/**
 * CredLayer AI Agent Trust API
 * Endpoints for AI agent reputation and trust scoring
 */

import { apiClient } from './client';
import type {
  AgentTrust,
  AgentBehavior,
  AgentAnalysisRequest,
} from '@/types/ai-agent';

/**
 * Analyze an AI agent's trust score
 */
export async function analyzeAgent(
  request: AgentAnalysisRequest
): Promise<AgentTrust> {
  return apiClient.post<AgentTrust>('/ai-agent/analyze', request);
}

/**
 * Get AI agent trust score
 */
export async function getAgentTrust(agentId: string): Promise<AgentTrust> {
  return apiClient.get<AgentTrust>(`/ai-agent/${agentId}/trust`);
}

/**
 * Get AI agent behavioral data
 */
export async function getAgentBehavior(
  agentId: string
): Promise<AgentBehavior> {
  return apiClient.get<AgentBehavior>(`/ai-agent/${agentId}/behavior`);
}

/**
 * Get agent verification status
 */
export async function getAgentVerification(agentId: string) {
  return apiClient.get(`/ai-agent/${agentId}/verification`);
}
