import { apiClient, ApiResponse, User, LoginResponse } from './api';

// Authentication Service
export class AuthService {
  // Register new user
  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string; userId: string }>> {
    return apiClient.post('/auth/register', userData);
  }

  // Login user
  async login(credentials: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);

      return response;

    } catch (error: any) {
      console.error('Login service error: ', error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Login failed due to network error';

      return {
        success: false,
        message: errorMessage,
        data: undefined
      };
    }
  }

  // Logout user
  async logout(): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post<{ message: string }>('/auth/logout');

    // Clear local storage regardless of API response
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    return response;
  }

  // Verify email with code
  async verifyEmail(data: {
    email: string;
    verificationCode: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/verify-email', data);
  }

  // Resend email verification code
  async resendVerificationCode(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/resend-verification', { email });
  }

  // Social login (Google, Facebook, GitHub)
  async socialLogin(provider: string, token: string): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post('/auth/social-login', { provider, token });
  }

  // Refresh access token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string; expiresIn: number }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    return apiClient.post('/auth/refresh', { refreshToken });
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/auth/me');
  }

  // Update user profile
  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    gender?: string;
    birthDate?: string;
    profileImage?: string;
  }): Promise<ApiResponse<User>> {
    return apiClient.put('/auth/profile', profileData);
  }

  // Upload profile image
  async uploadProfileImage(file: File): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile('/auth/profile/image', file);
  }

  // Update user preferences
  async updatePreferences(preferences: string[]): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/auth/preferences', { preferences });
  }

  // forgot user password
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/forgot-password', { email });
  }

  async verifyResetCode(email: string, code: string): Promise<ApiResponse<{ resetToken: string }>> {
    try {

      const response = await apiClient.post<{ resetToken: string }>('/auth/verify-reset-code', { email, code });
      // More defensive check
      if (response.success && response.data) {
      } else {
        console.warn('Response indicates failure or missing data');
      }

      return {
        success: response.success,
        data: response.data,
        message: response.message
      };
    } catch (error: any) {
      console.error('Verify reset code service error:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to verify reset code';

      return {
        success: false,
        message: errorMessage,
        data: undefined
      };
    }
  }

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/auth/change-password', data);
  }

  async resetPassword(data: {
    resetToken: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/auth/reset-password', data);
  }
}

export const authService = new AuthService();
