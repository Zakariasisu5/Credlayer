import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/services/api';
import type { WalletAuthRequest, SignMessageRequest } from '@/types/auth';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Get Current User
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authApi.me(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get Sign Message
export function useGetSignMessage() {
  return useMutation({
    mutationFn: (data: SignMessageRequest) => authApi.getSignMessage(data),
  });
}

// Authenticate with Wallet
export function useAuthenticateWallet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: WalletAuthRequest) => authApi.authenticateWallet(data),
    onSuccess: (response) => {
      // Store tokens
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('refreshToken', response.data.tokens.refreshToken);
      
      // Update user query
      queryClient.setQueryData(authKeys.user(), response.data.user);
    },
  });
}

// Logout
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      // Clear all queries
      queryClient.clear();
    },
  });
}
