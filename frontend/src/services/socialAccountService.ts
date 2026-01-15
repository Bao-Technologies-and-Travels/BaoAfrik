import { apiClient } from './api';

export interface SocialAccount {
  id: string;
  provider: 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'x' | 'google' | 'apple';
  providerName: string | null;
  providerEmail: string | null;
  isConnected: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccountStatus {
  status: Record<string, boolean>;
  connectedCount: number;
  hasFirstLevelVerification: boolean;
}

export const socialAccountService = {
  /**
   * Get all social accounts
   */
  async getAccounts(): Promise<SocialAccount[]> {
    const response = await apiClient.get<SocialAccount[]>('/social-accounts');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch social accounts');
  },

  /**
   * Get social account status
   */
  async getStatus(): Promise<SocialAccountStatus> {
    const response = await apiClient.get<SocialAccountStatus>('/social-accounts/status');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch social account status');
  },

  /**
   * Connect a social account
   */
  async connect(
    provider: string,
    providerId: string,
    providerEmail?: string,
    providerName?: string,
    accessToken?: string,
    refreshToken?: string
  ): Promise<void> {
    const response = await apiClient.post('/social-accounts/connect', {
      provider,
      providerId,
      providerEmail,
      providerName,
      accessToken,
      refreshToken,
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to connect social account');
    }
  },

  /**
   * Disconnect a social account
   */
  async disconnect(provider: string): Promise<void> {
    const response = await apiClient.delete(`/social-accounts/${provider}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to disconnect social account');
    }
  },
};
