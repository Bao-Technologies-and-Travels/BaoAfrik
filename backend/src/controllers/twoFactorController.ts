import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '@/config/database';
import { asyncHandler } from '@/middleware/errorMiddleware';
import { createUnauthorizedError, createValidationError } from '@/middleware/errorMiddleware';
import { generateVerificationCode } from '@/utils/jwtUtils';
import { ApiResponse } from '@/types/auth';
import logger from '@/config/logger';
import { sendVerificationEmail } from '@/utils/emailService';
import { sendOTP } from '@/utils/smsService';

/**
 * Enable two-factor authentication
 */
export const enableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { method, phoneNumber, phoneCode } = req.body;

  if (!method || !['email', 'phone'].includes(method)) {
    throw createValidationError('Method must be either "email" or "phone"');
  }

  if (method === 'phone' && (!phoneNumber || !phoneCode)) {
    throw createValidationError('Phone number and country code are required for phone 2FA');
  }

  // Check if user has phone number if using phone method
  if (method === 'phone') {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { phoneNumber: true }
    });

    if (!user?.phoneNumber && !phoneNumber) {
      throw createValidationError('Phone number is required for phone-based 2FA');
    }
  }

  // Generate verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Create or update 2FA record
  const twoFactorAuth = await prisma.twoFactorAuth.upsert({
    where: { userId: req.user.id },
    create: {
      userId: req.user.id,
      isEnabled: false, // Will be enabled after verification
      method: method,
      phoneNumber: method === 'phone' ? (phoneNumber || null) : null,
      phoneCode: method === 'phone' ? (phoneCode || null) : null,
      verificationCode: verificationCode,
      verificationExpires: verificationExpires,
    },
    update: {
      method: method,
      phoneNumber: method === 'phone' ? (phoneNumber || null) : null,
      phoneCode: method === 'phone' ? (phoneCode || null) : null,
      verificationCode: verificationCode,
      verificationExpires: verificationExpires,
      isEnabled: false,
    }
  });

  // Send verification code
  if (method === 'email') {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true }
    });

    if (user) {
      try {
        await sendVerificationEmail(user.email, verificationCode);
      } catch (error) {
        logger.error('Failed to send 2FA verification email:', error);
        throw new Error('Failed to send verification code. Please try again.');
      }
    }
  } else if (method === 'phone') {
    const fullPhoneNumber = `${phoneCode}${phoneNumber}`;
    try {
      await sendOTP(fullPhoneNumber, verificationCode);
      logger.info('2FA phone verification code sent via Twilio', {
        userId: req.user.id,
        phoneNumber: fullPhoneNumber
      });
    } catch (error) {
      logger.error('Failed to send 2FA OTP via Twilio:', error);
      throw new Error('Failed to send verification code. Please try again.');
    }
  }

  logger.info('2FA setup initiated', {
    userId: req.user.id,
    method
  });

  const response: ApiResponse = {
    success: true,
    message: 'Verification code sent. Please verify to enable 2FA.',
    data: {
      method,
      expiresIn: 300 // 5 minutes in seconds
    }
  };

  res.json(response);
});

/**
 * Verify 2FA code and enable 2FA
 */
export const verifyTwoFactorCode = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { code } = req.body;

  if (!code || code.length !== 6) {
    throw createValidationError('Verification code is required and must be 6 digits');
  }

  const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
    where: { userId: req.user.id }
  });

  if (!twoFactorAuth) {
    throw createValidationError('2FA setup not initiated. Please start the setup process first.');
  }

  if (twoFactorAuth.verificationCode !== code) {
    throw createValidationError('Invalid verification code');
  }

  if (!twoFactorAuth.verificationExpires || twoFactorAuth.verificationExpires < new Date()) {
    throw createValidationError('Verification code has expired. Please request a new one.');
  }

  // Enable 2FA
  await prisma.twoFactorAuth.update({
    where: { userId: req.user.id },
    data: {
      isEnabled: true,
      verificationCode: null,
      verificationExpires: null,
    }
  });

  logger.info('2FA enabled successfully', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    message: 'Two-factor authentication enabled successfully'
  };

  res.json(response);
});

/**
 * Disable two-factor authentication
 */
export const disableTwoFactor = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
    where: { userId: req.user.id }
  });

  if (!twoFactorAuth || !twoFactorAuth.isEnabled) {
    throw createValidationError('Two-factor authentication is not enabled');
  }

  await prisma.twoFactorAuth.update({
    where: { userId: req.user.id },
    data: {
      isEnabled: false,
      verificationCode: null,
      verificationExpires: null,
    }
  });

  logger.info('2FA disabled', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    message: 'Two-factor authentication disabled successfully'
  };

  res.json(response);
});

/**
 * Get 2FA status
 */
export const getTwoFactorStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
    where: { userId: req.user.id }
  });

  const response: ApiResponse = {
    success: true,
    data: {
      isEnabled: twoFactorAuth?.isEnabled || false,
      method: twoFactorAuth?.method || null,
      phoneNumber: twoFactorAuth?.phoneNumber ? 
        `${twoFactorAuth.phoneNumber.substring(0, 1)}${'*'.repeat(Math.max(0, twoFactorAuth.phoneNumber.length - 1))}` : 
        null,
      phoneCode: twoFactorAuth?.phoneCode || null,
    }
  };

  res.json(response);
});

/**
 * Resend 2FA verification code
 */
export const resendTwoFactorCode = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const twoFactorAuth = await prisma.twoFactorAuth.findUnique({
    where: { userId: req.user.id }
  });

  if (!twoFactorAuth) {
    throw createValidationError('2FA setup not initiated');
  }

  // Generate new verification code
  const verificationCode = generateVerificationCode();
  const verificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await prisma.twoFactorAuth.update({
    where: { userId: req.user.id },
    data: {
      verificationCode: verificationCode,
      verificationExpires: verificationExpires,
    }
  });

  // Send verification code
  if (twoFactorAuth.method === 'email') {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { email: true }
    });

    if (user) {
      try {
        await sendVerificationEmail(user.email, verificationCode);
      } catch (error) {
        logger.error('Failed to resend 2FA verification email:', error);
        throw new Error('Failed to send verification code. Please try again.');
      }
    }
  } else if (twoFactorAuth.method === 'phone') {
    if (!twoFactorAuth.phoneNumber || !twoFactorAuth.phoneCode) {
      throw createValidationError('Phone number not configured for 2FA');
    }
    const fullPhoneNumber = `${twoFactorAuth.phoneCode}${twoFactorAuth.phoneNumber}`;
    try {
      await sendOTP(fullPhoneNumber, verificationCode);
      logger.info('2FA phone verification code resent via Twilio', {
        userId: req.user.id,
        phoneNumber: fullPhoneNumber
      });
    } catch (error) {
      logger.error('Failed to resend 2FA OTP via Twilio:', error);
      throw new Error('Failed to send verification code. Please try again.');
    }
  }

  const response: ApiResponse = {
    success: true,
    message: 'Verification code resent successfully',
    data: {
      expiresIn: 300 // 5 minutes in seconds
    }
  };

  res.json(response);
});

/**
 * Verify user credentials (email and password)
 * Used before enabling 2FA
 */
export const verifyCredentials = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { email, password } = req.body;

  if (!email || !password) {
    throw createValidationError('Email and password are required');
  }

  // Get current user
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      email: true,
      passwordHash: true
    }
  });

  if (!user) {
    throw createUnauthorizedError('User not found');
  }

  // Verify email matches
  if (user.email.toLowerCase() !== email.toLowerCase()) {
    throw createUnauthorizedError('Invalid email');
  }

  // Verify password
  if (!user.passwordHash) {
    throw createUnauthorizedError('Password not set for this account');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  
  if (!isPasswordValid) {
    throw createUnauthorizedError('Invalid password');
  }

  const response: ApiResponse = {
    success: true,
    message: 'Credentials verified successfully'
  };

  res.json(response);
});

export default {
  enableTwoFactor,
  verifyTwoFactorCode,
  disableTwoFactor,
  getTwoFactorStatus,
  resendTwoFactorCode,
  verifyCredentials
};
