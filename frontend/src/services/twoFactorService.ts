import { apiClient } from './api';

export interface TwoFactorStatus {
  isEnabled: boolean;
  method: 'email' | 'phone' | null;
  phoneNumber: string | null;
  phoneCode: string | null;
}

export const twoFactorService = {
  /**
   * Get 2FA status
   */
  async getStatus(): Promise<TwoFactorStatus> {
    const response = await apiClient.get<TwoFactorStatus>('/two-factor/status');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch 2FA status');
  },

  /**
   * Enable 2FA
   */
  async enable(method: 'email' | 'phone', phoneNumber?: string, phoneCode?: string): Promise<void> {
    const response = await apiClient.post('/two-factor/enable', {
      method,
      phoneNumber,
      phoneCode,
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to enable 2FA');
    }
  },

  /**
   * Verify 2FA code
   */
  async verifyCode(code: string): Promise<void> {
    const response = await apiClient.post('/two-factor/verify', { code });
    if (!response.success) {
      throw new Error(response.message || 'Invalid verification code');
    }
  },

  /**
   * Disable 2FA
   */
  async disable(): Promise<void> {
    const response = await apiClient.post('/two-factor/disable');
    if (!response.success) {
      throw new Error(response.message || 'Failed to disable 2FA');
    }
  },

  /**
   * Resend verification code
   */
  async resendCode(): Promise<void> {
    const response = await apiClient.post('/two-factor/resend-code');
    if (!response.success) {
      throw new Error(response.message || 'Failed to resend code');
    }
  },
};
