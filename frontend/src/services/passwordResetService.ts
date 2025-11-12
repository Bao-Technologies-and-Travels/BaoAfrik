import { apiClient, ApiResponse } from './api';

// Password Reset Service
export class PasswordResetService {
  // Request password reset (send email)
  async requestPasswordReset(email: string): Promise<ApiResponse<{ 
    message: string; 
    resetToken?: string; // For development/testing
  }>> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  // Verify reset code
  async verifyResetCode(data: {
    email: string;
    resetCode: string;
  }): Promise<ApiResponse<{ 
    message: string; 
    resetToken: string; 
  }>> {
    return apiClient.post('/auth/verify-reset-code', data);
  }

  // Reset password with new password
  async resetPassword(data: {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/reset-password', data);
  }

  // Resend reset code
  async resendResetCode(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/resend-reset-code', { email });
  }
}

export const passwordResetService = new PasswordResetService();
