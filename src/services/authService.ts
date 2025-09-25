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
    return apiClient.post('/auth/login', credentials);
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

  // Change password
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/auth/change-password', data);
  }
}

export const authService = new AuthService();
