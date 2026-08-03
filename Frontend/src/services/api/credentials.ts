import api from './client';
import type { PaginationParams, PaginatedResponse } from '@/types/api';
import type {
  Credential,
  IssueCredentialRequest,
  VerifyCredentialRequest,
  RevokeCredentialRequest,
} from '@/types/credential';

export const credentialsApi = {
  // Get all credentials for current user
  getMyCredentials: async (params?: PaginationParams) => {
    return api.get<PaginatedResponse<Credential>>('/credentials/me', { params });
  },

  // Get credential by ID
  getCredential: async (credentialId: string) => {
    return api.get<Credential>(`/credentials/${credentialId}`);
  },

  // Get credentials by wallet address
  getWalletCredentials: async (address: string, params?: PaginationParams) => {
    return api.get<PaginatedResponse<Credential>>(`/credentials/wallet/${address}`, { params });
  },

  // Issue new credential
  issueCredential: async (data: IssueCredentialRequest) => {
    return api.post<Credential>('/credentials', data);
  },

  // Verify credential
  verifyCredential: async (data: VerifyCredentialRequest) => {
    return api.post<{ valid: boolean; credential: Credential }>('/credentials/verify', data);
  },

  // Revoke credential
  revokeCredential: async (data: RevokeCredentialRequest) => {
    return api.post<void>('/credentials/revoke', data);
  },

  // Get credential verification proof
  getProof: async (credentialId: string) => {
    return api.get<Credential['proof']>(`/credentials/${credentialId}/proof`);
  },
};
