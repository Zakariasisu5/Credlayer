import api from './client';
import type { User, UserProfile, UpdateUserRequest } from '@/types/user';

export const usersApi = {
  // Get user profile
  getProfile: async (userId?: string) => {
    const endpoint = userId ? `/users/${userId}` : '/users/me';
    return api.get<UserProfile>(endpoint);
  },

  // Update user profile
  updateProfile: async (data: UpdateUserRequest) => {
    return api.patch<User>('/users/me', data);
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return api.post<{ avatarUrl: string }>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Delete account
  deleteAccount: async () => {
    return api.delete<void>('/users/me');
  },
};
