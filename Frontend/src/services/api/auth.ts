import api from './client';
import type {
  AuthResponse,
  WalletAuthRequest,
  RefreshTokenRequest,
  SignMessageRequest,
  SignMessageResponse,
} from '@/types/auth';

export const authApi = {
  // Get sign message for wallet authentication
  getSignMessage: async (data: SignMessageRequest) => {
    return api.post<SignMessageResponse>('/auth/message', data);
  },

  // Authenticate with wallet signature
  authenticateWallet: async (data: WalletAuthRequest) => {
    return api.post<AuthResponse>('/auth/wallet', data);
  },

  // Refresh access token
  refreshToken: async (data: RefreshTokenRequest) => {
    return api.post<AuthResponse>('/auth/refresh', data);
  },

  // Logout
  logout: async () => {
    return api.post<void>('/auth/logout');
  },

  // Get current authenticated user
  me: async () => {
    return api.get<AuthResponse['user']>('/auth/me');
  },
};
