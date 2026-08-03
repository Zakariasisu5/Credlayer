import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { credentialsApi } from '@/services/api';
import type { IssueCredentialRequest, VerifyCredentialRequest, RevokeCredentialRequest } from '@/types/credential';

// Query Keys
export const credentialKeys = {
  all: ['credentials'] as const,
  my: (page?: number) => [...credentialKeys.all, 'me', page] as const,
  byId: (id: string) => [...credentialKeys.all, 'id', id] as const,
  byWallet: (address: string, page?: number) => 
    [...credentialKeys.all, 'wallet', address, page] as const,
};

// Get My Credentials
export function useMyCredentials(page?: number) {
  return useQuery({
    queryKey: credentialKeys.my(page),
    queryFn: () => credentialsApi.getMyCredentials({ page }),
  });
}

// Get Credential by ID
export function useCredential(credentialId: string) {
  return useQuery({
    queryKey: credentialKeys.byId(credentialId),
    queryFn: () => credentialsApi.getCredential(credentialId),
    enabled: !!credentialId,
  });
}

// Get Wallet Credentials
export function useWalletCredentials(address: string, page?: number) {
  return useQuery({
    queryKey: credentialKeys.byWallet(address, page),
    queryFn: () => credentialsApi.getWalletCredentials(address, { page }),
    enabled: !!address,
  });
}

// Issue Credential
export function useIssueCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: IssueCredentialRequest) => credentialsApi.issueCredential(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: credentialKeys.my() });
    },
  });
}

// Verify Credential
export function useVerifyCredential() {
  return useMutation({
    mutationFn: (data: VerifyCredentialRequest) => credentialsApi.verifyCredential(data),
  });
}

// Revoke Credential
export function useRevokeCredential() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RevokeCredentialRequest) => credentialsApi.revokeCredential(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: credentialKeys.all });
    },
  });
}
