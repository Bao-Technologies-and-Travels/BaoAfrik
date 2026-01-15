import { Request, Response } from 'express';
import prisma from '@/config/database';
import { asyncHandler } from '@/middleware/errorMiddleware';
import { createUnauthorizedError, createValidationError, createConflictError } from '@/middleware/errorMiddleware';
import { ApiResponse } from '@/types/auth';
import logger from '@/config/logger';

const VALID_PROVIDERS = ['whatsapp', 'facebook', 'instagram', 'linkedin', 'x', 'google', 'apple'];

/**
 * Connect a social account
 */
export const connectSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { provider, providerId, providerEmail, providerName, accessToken, refreshToken, tokenExpiresAt } = req.body;

  if (!provider || !VALID_PROVIDERS.includes(provider.toLowerCase())) {
    throw createValidationError(`Provider must be one of: ${VALID_PROVIDERS.join(', ')}`);
  }

  if (!providerId) {
    throw createValidationError('Provider ID is required');
  }

  // Check if account is already connected
  const existingAccount = await prisma.socialAccount.findUnique({
    where: {
      userId_provider: {
        userId: req.user.id,
        provider: provider.toLowerCase()
      }
    }
  });

  if (existingAccount && existingAccount.isConnected) {
    throw createConflictError(`This ${provider} account is already connected`);
  }

  // Create or update social account
  const socialAccount = await prisma.socialAccount.upsert({
    where: {
      userId_provider: {
        userId: req.user.id,
        provider: provider.toLowerCase()
      }
    },
    create: {
      userId: req.user.id,
      provider: provider.toLowerCase(),
      providerId: providerId,
      providerEmail: providerEmail || null,
      providerName: providerName || null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
      isConnected: true,
    },
    update: {
      providerId: providerId,
      providerEmail: providerEmail || null,
      providerName: providerName || null,
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
      tokenExpiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
      isConnected: true,
    }
  });

  logger.info('Social account connected', {
    userId: req.user.id,
    provider: provider.toLowerCase()
  });

  const response: ApiResponse = {
    success: true,
    message: `${provider} account connected successfully`,
    data: {
      id: socialAccount.id,
      provider: socialAccount.provider,
      providerName: socialAccount.providerName,
      isConnected: socialAccount.isConnected
    }
  };

  res.json(response);
});

/**
 * Disconnect a social account
 */
export const disconnectSocialAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { provider } = req.params;

  if (!provider || !VALID_PROVIDERS.includes(provider.toLowerCase())) {
    throw createValidationError(`Provider must be one of: ${VALID_PROVIDERS.join(', ')}`);
  }

  const socialAccount = await prisma.socialAccount.findUnique({
    where: {
      userId_provider: {
        userId: req.user.id,
        provider: provider.toLowerCase()
      }
    }
  });

  if (!socialAccount) {
    throw createValidationError(`${provider} account is not connected`);
  }

  // Mark as disconnected instead of deleting (for history)
  await prisma.socialAccount.update({
    where: {
      userId_provider: {
        userId: req.user.id,
        provider: provider.toLowerCase()
      }
    },
    data: {
      isConnected: false,
      accessToken: null,
      refreshToken: null,
      tokenExpiresAt: null,
    }
  });

  logger.info('Social account disconnected', {
    userId: req.user.id,
    provider: provider.toLowerCase()
  });

  const response: ApiResponse = {
    success: true,
    message: `${provider} account disconnected successfully`
  };

  res.json(response);
});

/**
 * Get all connected social accounts
 */
export const getSocialAccounts = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const socialAccounts = await prisma.socialAccount.findMany({
    where: {
      userId: req.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Format response (don't expose tokens)
  const formattedAccounts = socialAccounts.map(account => ({
    id: account.id,
    provider: account.provider,
    providerName: account.providerName,
    providerEmail: account.providerEmail,
    isConnected: account.isConnected,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  }));

  const response: ApiResponse = {
    success: true,
    data: formattedAccounts
  };

  res.json(response);
});

/**
 * Get connection status for all supported providers
 */
export const getSocialAccountStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const socialAccounts = await prisma.socialAccount.findMany({
    where: {
      userId: req.user.id,
      isConnected: true
    }
  });

  // Create status map for all providers
  const status: Record<string, boolean> = {};
  VALID_PROVIDERS.forEach(provider => {
    status[provider] = socialAccounts.some(account => account.provider === provider);
  });

  // Count connected accounts for verification level
  const connectedCount = Object.values(status).filter(Boolean).length;

  const response: ApiResponse = {
    success: true,
    data: {
      status,
      connectedCount,
      hasFirstLevelVerification: connectedCount >= 2 // At least 2 accounts for first-level verification
    }
  };

  res.json(response);
});

export default {
  connectSocialAccount,
  disconnectSocialAccount,
  getSocialAccounts,
  getSocialAccountStatus
};
