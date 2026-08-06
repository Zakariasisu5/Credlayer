export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
  preferences?: UserPreferences;
  subscription?: SubscriptionTier;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    webhook: boolean;
    reputationChanges: boolean;
    riskTransitions: boolean;
    newCredentials: boolean;
  };
  privacy?: {
    publicProfile: boolean;
    shareDeFiActivity: boolean;
    shareNFTActivity: boolean;
  };
  security?: {
    requireSignatureForApiKeys: boolean;
  };
  language?: string;
  timezone?: string;
}

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise';

export interface UserProfile extends User {
  stats: {
    totalCredentials: number;
    verifiedCredentials: number;
    reputationScore: number;
    lastActivity: string;
  };
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
  preferences?: Partial<UserPreferences>;
}
