import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api';
import type { UpdateUserRequest } from '@/types/user';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  profile: (userId?: string) => [...userKeys.all, 'profile', userId] as const,
};

// Get User Profile
export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => usersApi.getProfile(userId),
  });
}

// Update Profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

// Upload Avatar
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => usersApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

// Delete Account
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => usersApi.deleteAccount(),
    onSuccess: () => {
      // Clear all data
      localStorage.clear();
      queryClient.clear();
      window.location.href = '/';
    },
  });
}
