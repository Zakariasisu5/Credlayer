import api from './client';
import type { PaginationParams } from '@/types/api';
import type {
  Wallet,
  WalletActivity,
  WalletAnalytics,
  WalletAddress,
} from '@/types/wallet';

export const walletsApi = {
  // Get wallet reputation (main profile)
  getWalletReputation: async (address: string, chain?: string) => {
    const params = chain ? { chain } : {};
    return api.get<Wallet>(`/wallets/${address}`, { params });
  },

  // Get wallet activity timeline
  getWalletActivity: async (address: string, params?: PaginationParams) => {
    return api.getPaginated<WalletActivity>(`/wallets/${address}/activity`, { params });
  },

  // Get wallet analytics
  getAnalytics: async (address: string, chain?: string) => {
    const params = chain ? { chain } : {};
    return api.get<WalletAnalytics>(`/wallets/${address}/analytics`, { params });
  },

  // Search wallets by address or ENS
  searchWallets: async (query: string, params?: PaginationParams) => {
    return api.getPaginated<Wallet>('/wallets/search', {
      params: { query, ...params },
    });
  },

  // Get connected wallets for current user
  getConnectedWallets: async () => {
    return api.get<WalletAddress[]>('/wallets/me');
  },

  // Connect new wallet
  connectWallet: async (data: { address: string; chain: string; signature: string }) => {
    return api.post<WalletAddress>('/wallets/me/connect', data);
  },

  // Disconnect wallet
  disconnectWallet: async (address: string) => {
    return api.delete<void>(`/wallets/me/${address}`);
  },

  // Set primary wallet
  setPrimaryWallet: async (address: string) => {
    return api.patch<void>(`/wallets/me/${address}/primary`);
  },
};
