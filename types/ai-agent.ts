/**
 * CredLayer AI Agent Trust Types
 * These types define the structure of AI agent trust data
 */

export type AgentRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AgentVerificationStatus = 'VERIFIED' | 'UNVERIFIED' | 'PENDING' | 'SUSPENDED';

export interface AgentSignal {
  signal_type: string;
  value: number;
  description: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface AgentTrust {
  agent_id: string;
  agent_name?: string;
  trust_score: number; // 0-100
  risk_level: AgentRiskLevel;
  verification_status: AgentVerificationStatus;
  signals: AgentSignal[];
  attestation_id?: string;
  last_analyzed: string;
  confidence: number;
  summary?: string;
}

export interface AgentBehavior {
  agent_id: string;
  transaction_count: number;
  success_rate: number;
  avg_transaction_value: number;
  protocol_interactions: string[];
  risk_indicators: string[];
  trust_indicators: string[];
}

export interface AgentAnalysisRequest {
  agent_id: string;
  force_refresh?: boolean;
}
