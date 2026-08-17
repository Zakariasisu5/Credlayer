/**
 * CredLayer Wallet Types
 * These types define wallet-related structures
 */

export type SolanaNetwork = 'mainnet-beta' | 'devnet' | 'testnet';
export type WalletConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

export interface WalletState {
  address: string | null;
  connected: boolean;
  status: WalletConnectionStatus;
  network: SolanaNetwork;
  balance?: number;
  error?: string;
}

export interface WalletInfo {
  address: string;
  network: SolanaNetwork;
  balance: number;
  first_seen?: string;
  last_active?: string;
  transaction_count?: number;
}

export interface WalletActivity {
  wallet: string;
  activities: WalletActivityItem[];
  total: number;
}

export interface WalletActivityItem {
  id: string;
  type: 'ANALYSIS' | 'CREDENTIAL_ISSUED' | 'CREDENTIAL_VERIFIED' | 'ATTESTATION' | 'API_REQUEST';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
  status?: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface ConnectedWallet {
  address: string;
  publicKey: string;
  signMessage?: (message: Uint8Array) => Promise<Uint8Array>;
  signTransaction?: (transaction: unknown) => Promise<unknown>;
}
