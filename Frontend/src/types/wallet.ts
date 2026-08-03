export type Chain = 'ethereum' | 'polygon' | 'arbitrum' | 'optimism' | 'base' | 'solana' | 'avalanche';

export interface WalletAddress {
  address: string;
  chain: Chain;
  isPrimary: boolean;
  verifiedAt?: string;
  label?: string;
}

export interface Wallet {
  address: string;
  chain: Chain;
  score: number; // 0-1000
  tier: ReputationTier;
  trust: number; // 0-100 percentage
  risk: RiskLevel;
  ageYears: number;
  chains: number;
  signals: number;
  tx30d: number;
  volumeUsd: number;
  contracts: number;
  metrics: BehaviorMetric[];
  credentials: string[];
  aiSummary: string;
  lastUpdated: string;
}

export interface BehaviorMetric {
  key: string;
  value: number; // 0-100 percentage
  tone: 'gold' | 'azure' | 'success' | 'warn';
}

export type ReputationTier = 'Excellent' | 'Strong' | 'Fair' | 'Emerging' | 'New';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WalletActivity {
  id: string;
  time: string; // e.g., "2m ago"
  label: string;
  meta: string;
  type?: ActivityType;
  chain?: Chain;
  txHash?: string;
}

export type ActivityType = 
  | 'transaction' 
  | 'credential_issued' 
  | 'credential_verified' 
  | 'reputation_updated' 
  | 'badge_earned'
  | 'nft_transfer'
  | 'defi_interaction'
  | 'governance_vote'
  | 'attestation_verified'
  | 'protocol_interaction';

export interface WalletAnalytics {
  address: string;
  chain: Chain;
  totalValue: string;
  tokens: TokenBalance[];
  nfts: NFTHolding[];
  defiPositions: DefiPosition[];
  recentActivity: WalletActivity[];
}

export interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  price?: number;
  valueUSD?: number;
  logoUrl?: string;
}

export interface NFTHolding {
  contractAddress: string;
  tokenId: string;
  name: string;
  collection: string;
  imageUrl?: string;
  floorPrice?: number;
  lastTransfer?: string;
}

export interface DefiPosition {
  protocol: string;
  type: 'lending' | 'staking' | 'liquidity' | 'farming';
  value: string;
  apy?: number;
  since: string;
}
