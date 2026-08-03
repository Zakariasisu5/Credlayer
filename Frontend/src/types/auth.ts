export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  tokenType: 'Bearer';
}

export interface AuthUser {
  id: string;
  walletAddress: string;
  email?: string;
  role: UserRole;
  permissions: string[];
  isEmailVerified: boolean;
  createdAt: string;
}

export type UserRole = 'user' | 'developer' | 'admin';

export interface WalletAuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
  chain: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface SignMessageRequest {
  walletAddress: string;
  chain: string;
}

export interface SignMessageResponse {
  message: string;
  nonce: string;
  expiresAt: string;
}
