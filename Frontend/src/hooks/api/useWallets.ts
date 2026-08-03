import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletsApi } from '@/services/api';

// Query Keys
export const walletKeys = {
  all: ['wallets'] as const,
  wallet: (address: string, chain?: string) => 
    [...walletKeys.all, 'wallet', address, chain] as const,
  activity: (address: string, page?: number) => 
    [...walletKeys.all, 'activity', address, page] as const,
  analytics: (address: string, chain?: string) => 
    [...walletKeys.all, 'analytics', address, chain] as const,
  connected: () => [...walletKeys.all, 'connected'] as const,
  search: (query: string) => [...walletKeys.all, 'search', query] as const,
};

// Wallet Profile (reputation + data)
export function useWalletProfile(address: string, chain?: string) {
  return useQuery({
    queryKey: walletKeys.wallet(address, chain),
    queryFn: () => walletsApi.getWalletReputation(address, chain),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Wallet Activity
export function useWalletActivityQuery(address: string, page?: number) {
  return useQuery({
    queryKey: walletKeys.activity(address, page),
    queryFn: () => walletsApi.getWalletActivity(address, { page }),
    enabled: !!address,
  });
}

// Wallet Analytics
export function useWalletAnalytics(address: string, chain?: string) {
  return useQuery({
    queryKey: walletKeys.analytics(address, chain),
    queryFn: () => walletsApi.getAnalytics(address, chain),
    enabled: !!address,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Search Wallets
export function useWalletSearch(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: walletKeys.search(query),
    queryFn: () => walletsApi.searchWallets(query),
    enabled: enabled && query.length >= 3,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Connected Wallets
export function useConnectedWallets() {
  return useQuery({
    queryKey: walletKeys.connected(),
    queryFn: () => walletsApi.getConnectedWallets(),
  });
}

export function useConnectWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { address: string; chain: string; signature: string }) =>
      walletsApi.connectWallet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.connected() });
    },
  });
}

export function useDisconnectWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (address: string) => walletsApi.disconnectWallet(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.connected() });
    },
  });
}
