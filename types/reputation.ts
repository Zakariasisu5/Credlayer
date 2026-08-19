/**
 * CredLayer Reputation Types
 * These types define the structure of reputation data from the backend
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ReputationTier = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';

export interface BehavioralMetrics {
  wallet_age: number;
  transaction_behavior: number;
  protocol_diversity: number;
  sybil_resistance: number;
  defi_engagement?: number;
  risk_exposure?: number;
  transaction_consistency?: number;
}

export interface ReputationScore {
  wallet: string;
  score: number; // 0-1000
  trust_score: number; // 0-100
  risk_level: RiskLevel;
  tier: ReputationTier;
  confidence: number; // 0-1
  metrics: BehavioralMetrics;
  summary: string;
  model_version: string;
  updated_at: string;
  analysis_id?: string;
}

export interface ReputationHistory {
  wallet: string;
  history: ReputationHistoryPoint[];
}

export interface ReputationHistoryPoint {
  timestamp: string;
  score: number;
  trust_score: number;
  risk_level: RiskLevel;
}

export interface AnalysisRequest {
  wallet: string;
  force_refresh?: boolean;
}

export interface AnalysisStatus {
  wallet: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  estimated_completion?: string;
  error?: string;
}
