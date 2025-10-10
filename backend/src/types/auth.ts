export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  emailVerified: boolean;
  isVerifiedSeller: boolean;
  provider?: string;
  providerId?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  emailVerified: boolean;
  isVerifiedSeller: boolean;
  provider?: string;
  lastLoginAt?: Date;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface SocialLoginRequest {
  provider: string;
  token: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string;
  gender?: string;
  birthDate?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}
