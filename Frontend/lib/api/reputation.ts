/**
 * CredLayer Reputation API
 * Endpoints for wallet reputation analysis
 */

import { apiClient } from './client';
import type {
  ReputationScore,
  ReputationHistory,
  AnalysisRequest,
  AnalysisStatus,
} from '@/types/reputation';

/**
 * Analyze a wallet's reputation
 * This triggers the AI reputation engine analysis
 */
export async function analyzeWallet(
  wallet: string,
  forceRefresh: boolean = false
): Promise<ReputationScore> {
  const request: AnalysisRequest = {
    wallet,
    force_refresh: forceRefresh,
  };

  return apiClient.post<ReputationScore>('/reputation/analyze', request);
}

/**
 * Get reputation score for a wallet
 * Returns cached result if available
 */
export async function getWalletReputation(
  wallet: string
): Promise<ReputationScore> {
  return apiClient.get<ReputationScore>(`/reputation/${wallet}`);
}

/**
 * Get reputation history for a wallet
 * Returns historical reputation data points
 */
export async function getReputationHistory(
  wallet: string
): Promise<ReputationHistory> {
  return apiClient.get<ReputationHistory>(`/reputation/${wallet}/history`);
}

/**
 * Get analysis status
 * Check if analysis is in progress
 */
export async function getAnalysisStatus(
  wallet: string
): Promise<AnalysisStatus> {
  return apiClient.get<AnalysisStatus>(`/reputation/${wallet}/status`);
}

/**
 * Get wallet metrics
 * Returns detailed behavioral metrics
 */
export async function getWalletMetrics(wallet: string) {
  return apiClient.get(`/reputation/${wallet}/metrics`);
}
