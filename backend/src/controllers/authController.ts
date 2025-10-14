import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '@/middleware/errorMiddleware';
import {
  createValidationError,
  createUnauthorizedError,
  createConflictError
} from '@/middleware/errorMiddleware';
import {
  generateTokenPair,
  verifyRefreshToken,
  generateVerificationCode,
  generateSecureToken
} from '@/utils/jwtUtils';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  PublicUser,
  RefreshTokenRequest,
  EmailVerificationRequest,
  ResendVerificationRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ApiResponse
} from '@/types/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/utils/emailService';
import logger from '@/config/logger';

const prisma = new PrismaClient();

interface VerifyResetCodeRequest {
  email: string;
  code: string;
}

interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Register new user
 */
export const register = asyncHandler(async (req: Request<{}, {}, RegisterRequest>, res: Response) => {
  const { email, password, confirmPassword, phoneNumber } = req.body;

  // Check if passwords match
  if (password !== confirmPassword) {
    throw createValidationError('Passwords do not match');
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    throw createConflictError('User with this email already exists');
  }

  // Hash password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  const passwordHash = await bcrypt.hash(password, saltRounds);

  // Generate email verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Create user
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      phoneNumber,
      passwordHash,
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
      provider: 'local',
    },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      emailVerified: true,
      createdAt: true,
    }
  });

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationCode);
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    // Don't fail registration if email sending fails
  }

  logger.info('User registered successfully', {
    userId: user.id,
    email: user.email
  });

  const response: ApiResponse = {
    success: true,
    message: 'Registration successful. Please check your email for verification code.',
    data: {
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id
    }
  };

  res.status(201).json(response);
});

/**
 * Login user
 */
export const login = asyncHandler(async (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password, rememberMe = false } = req.body;

  // Find user with password
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
      isActive: true
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      passwordHash: true,
      profileImage: true,
      emailVerified: true,
      isVerifiedSeller: true,
      provider: true,
      lastLoginAt: true,
    }
  });

  if (!user) {
    throw createUnauthorizedError('Invalid email');
  }

  if(!user.passwordHash) {
    throw createUnauthorizedError('This account uses social login. Please sign in with your provider.');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createUnauthorizedError('Invalid password');
  }

  // Check email verification
  if (!user.emailVerified) {
    throw createUnauthorizedError('Please verify your email before logging in');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokenPair(user.id, user.email);

  // Calculate refresh token expiration (longer if rememberMe is true)
  const refreshTokenExpiresIn = rememberMe ? 30 : 7; // 30 days vs 7 days
  const expiresAt = new Date(Date.now() + refreshTokenExpiresIn * 24 * 60 * 60 * 1000);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    }
  });

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  // Create public user object
  const publicUser: PublicUser = {
    id: user.id,
    email: user.email,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    phoneNumber: user.phoneNumber || undefined,
    profileImage: user.profileImage || undefined,
    emailVerified: user.emailVerified,
    isVerifiedSeller: user.isVerifiedSeller,
    provider: user.provider || undefined,
    lastLoginAt: user.lastLoginAt || undefined,
  };

  logger.info('User logged in successfully', {
    userId: user.id,
    email: user.email,
    rememberMe
  });

  const responseData: LoginResponse = {
    accessToken,
    refreshToken,
    user: publicUser
  };

  const response: ApiResponse<LoginResponse> = {
    success: true,
    message: 'Login successful',
    data: responseData
  };

  res.json(response);
});

/**
 * Logout user
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.body.refreshToken;

  // If refresh token provided, remove it from database
  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken }
    });
  }

  // If user is authenticated, we can also remove all their refresh tokens
  if (req.user) {
    logger.info('User logged out', { userId: req.user.id });
  }

  console.log('Logged out user successfully');

  const response: ApiResponse = {
    success: true,
    message: 'Logged out successfully'
  };

  res.json(response);
});

/**
 * Refresh access token
 */
export const refreshToken = asyncHandler(async (req: Request<{}, {}, RefreshTokenRequest>, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createUnauthorizedError('Refresh token is required');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if refresh token exists in database and is not expired
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
      expiresAt: { gt: new Date() }
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          isActive: true,
          emailVerified: true,
        }
      }
    }
  });

  if (!storedToken || !storedToken.user.isActive || !storedToken.user.emailVerified) {
    throw createUnauthorizedError('Invalid or expired refresh token');
  }

  // Generate new access token
  const { accessToken: newAccessToken } = generateTokenPair(
    storedToken.user.id,
    storedToken.user.email
  );

  logger.info('Token refreshed successfully', {
    userId: storedToken.user.id
  });

  const response: ApiResponse = {
    success: true,
    data: {
      accessToken: newAccessToken,
      expiresIn: 15 * 60 // 15 minutes in seconds
    }
  };

  res.json(response);
});

/**
 * Verify email with code
 */
export const verifyEmail = asyncHandler(async (req: Request<{}, {}, EmailVerificationRequest>, res: Response) => {
  const { email, verificationCode } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
      emailVerificationCode: verificationCode,
      emailVerificationExpires: { gt: new Date() }
    }
  });

  if (!user) {
    throw createUnauthorizedError('Invalid or expired verification code');
  }

  // Update user as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationCode: null,
      emailVerificationExpires: null,
    }
  });

  logger.info('Email verified successfully', {
    userId: user.id,
    email: user.email
  });

  const response: ApiResponse = {
    success: true,
    message: 'Email verified successfully'
  };

  res.json(response);
});

/**
 * Resend email verification code
 */
export const resendVerificationCode = asyncHandler(async (req: Request<{}, {}, ResendVerificationRequest>, res: Response) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
      emailVerified: false
    }
  });

  if (!user) {
    throw createValidationError('User not found or already verified');
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Update user with new verification code
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerificationCode: verificationCode,
      emailVerificationExpires: verificationExpires,
    }
  });

  // Send verification email
  try {
    await sendVerificationEmail(user.email, verificationCode);
  } catch (error) {
    logger.error('Failed to resend verification email:', error);
    throw new Error('Failed to send verification email');
  }

  logger.info('Verification code resent', {
    userId: user.id,
    email: user.email
  });

  const response: ApiResponse = {
    success: true,
    message: 'Verification code sent successfully'
  };

  res.json(response);
});

/**
 * Get current user profile
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      profileImage: true,
      emailVerified: true,
      isVerifiedSeller: true,
      provider: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!user) {
    throw createValidationError('User not found');
  }

  const response: ApiResponse = {
    success: true,
    data: user
  };

  res.json(response);
});

/**
 * Update user profile
 */
export const updateProfile = asyncHandler(async (req: Request<{}, {}, UpdateProfileRequest>, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const {
    firstName,
    lastName,
    gender,
    birthDate,
    profileImage,
  } = req.body;

  const updateData: any = {};

  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (profileImage !== undefined) updateData.profileImage = profileImage;
  if (gender !== undefined) updateData.gender = gender;
  if (birthDate !== undefined) updateData.birthDate = new Date(birthDate);

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      profileImage: true,
      gender: true,
      birthDate: true,
      emailVerified: true,
      isVerifiedSeller: true,
      provider: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  logger.info('Profile updated successfully', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser
  };

  res.json(response);
});

/**
 * Forgot password
 */
export const forgotPassword = asyncHandler(async (req: Request<{}, {}, ForgotPasswordRequest>, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw createValidationError('Email is required');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createValidationError('Please provide a valid email address');
  }

  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
      isActive: true
    },
    select: {
      id: true,
      email: true,
      emailVerified: true
    }
  });

  if (!user) {
    throw createValidationError('If an account exists with this email, a reset code will be sent. Please check your email and spam folder.');
  }

  if (!user.emailVerified) {
    throw createValidationError('Please verify your email address before resetting your password. Check your inbox for the verification email.');
  }

  // Check for recent reset attempts (prevent spam)
  // const recentReset = await prisma.user.findFirst({
  //   where: {
  //     id: user.id,
  //     passwordResetExpires: {
  //       gt: new Date() 
  //     }
  //   }
  // });

  // if (recentReset) {
  //   throw createValidationError('A password reset has already been requested. Please check your email for the reset code or wait a few minutes to request a new one.');
  // }

  const resetCode = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetCode: resetCode,
      passwordResetExpires: expiresAt,
    }
  });

  try {
    await sendPasswordResetEmail(user.email, resetCode);
    logger.info(`Password reset code sent to: ${user.email}`);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset code has been sent to your email. Please check your inbox and spam folder.'
    };

    res.json(response);

  } catch (error) {
    logger.error('Failed to send password reset email:', error);

    throw createValidationError('Failed to send reset email. Please try again in a few minutes or contact support if the problem persists.');
  }
});

/**
 * Reset password
 */
/**
 * Reset password with token from code verification
 */
export const resetPassword = asyncHandler(async (req: Request<{}, {}, ResetPasswordRequest>, res: Response) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw createValidationError('New passwords do not match');
  }

  // Find user with valid reset token
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: resetToken,
      passwordResetTokenExpires: {  // CORRECT: Using passwordResetTokenExpires
        gt: new Date() // Token hasn't expired
      }
    },
    select: {
      id: true,
      email: true  // CORRECT: Including email in select
    }
  });

  if (!user) {
    throw createValidationError('Invalid or expired reset token');
  }

  // Hash new password and update user
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
      passwordResetExpires: null,
      passwordResetCode: null,
      updatedAt: new Date()
    }
  });

  // Invalidate all refresh tokens for security
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id }
  });

  logger.info(`Password reset successful for user: ${user.email}`);

  const response: ApiResponse = {
    success: true,
    message: 'Password has been reset successfully. You can now login with your new password.'
  };

  res.json(response);
});

export const verifyResetCode = asyncHandler(async (req: Request<{}, {}, VerifyResetCodeRequest>, res: Response) => {
  const { email, code } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
      passwordResetCode: code,
      passwordResetExpires: {
        gt: new Date() // Code hasn't expired
      }
    },
    select: {
      id: true,
      email: true
    }
  });

  if (!user) {
    throw createValidationError('Invalid or expired reset code');
  }

  // Generate a temporary token for password reset
  const resetToken = generateSecureToken();
  const tokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

  try {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpires: tokenExpiresAt,
        passwordResetCode: null,
      }
    });

  } catch (updateError) {
    console.error('[Backend] Failed to update user:', updateError);
    throw new Error('Failed to process reset request');
  }

  // Prepare response
  const response: ApiResponse = {
    success: true,
    data: {
      resetToken: resetToken // Explicitly setting it
    },
    message: 'Reset code verified successfully'
  };

  res.json(response);
});

/**
 * Change user password
 */
export const changePassword = asyncHandler(async (req: Request<{}, {}, ChangePasswordRequest>, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw createValidationError('New passwords do not match');
  }

  // Get user with password hash
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { passwordHash: true }
  });

  if (!user || !user.passwordHash) {
    throw createValidationError('User not found');
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isCurrentPasswordValid) {
    throw createUnauthorizedError('Current password is incorrect');
  }

  // Hash new password
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await prisma.user.update({
    where: { id: req.user.id },
    data: { passwordHash: newPasswordHash }
  });

  // Invalidate all refresh tokens for security
  await prisma.refreshToken.deleteMany({
    where: { userId: req.user.id }
  });

  logger.info('Password changed successfully', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    message: 'Password changed successfully'
  };

  res.json(response);
});

export default {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  resendVerificationCode,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyResetCode
};
