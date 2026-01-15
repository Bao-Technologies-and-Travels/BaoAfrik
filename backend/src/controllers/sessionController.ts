import { Request, Response } from 'express';
import prisma from '@/config/database';
import { asyncHandler } from '@/middleware/errorMiddleware';
import { createUnauthorizedError } from '@/middleware/errorMiddleware';
import { ApiResponse } from '@/types/auth';
import logger from '@/config/logger';

/**
 * Get all active sessions for the current user
 */
export const getUserSessions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: req.user.id,
      isActive: true,
    },
    orderBy: {
      lastActivityAt: 'desc'
    },
    include: {
      refreshToken: {
        select: {
          token: true,
          expiresAt: true
        }
      }
    }
  });

  // Get current refresh token from request body (POST) or headers (GET)
  const currentRefreshToken = req.body?.refreshToken || req.headers['x-refresh-token'] as string | undefined;
  
  // Format sessions for response
  const formattedSessions = sessions.map(session => {
    // Check if this session's refresh token matches the current one
    const isCurrent = currentRefreshToken && session.refreshToken?.token 
      ? session.refreshToken.token === currentRefreshToken 
      : false;
    
    return {
      id: session.id,
      browser: session.browser || 'Unknown',
      browserVersion: session.browserVersion || '',
      device: session.deviceName || 'Unknown Device',
      deviceType: session.deviceType || 'desktop',
      location: session.location || 'Unknown Location',
      country: session.country || '',
      city: session.city || '',
      os: session.os || 'Unknown',
      osVersion: session.osVersion || '',
      isCurrent: !!isCurrent,
      lastActivityAt: session.lastActivityAt,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    };
  });

  const response: ApiResponse = {
    success: true,
    data: formattedSessions
  };

  res.json(response);
});

/**
 * Revoke a specific session
 */
export const revokeSession = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { sessionId } = req.params;

  // Verify session belongs to user
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId: req.user.id,
    },
    include: {
      refreshToken: true
    }
  });

  if (!session) {
    throw createUnauthorizedError('Session not found');
  }

  // Delete refresh token if exists
  if (session.refreshTokenId && session.refreshToken) {
    await prisma.refreshToken.delete({
      where: { id: session.refreshTokenId }
    });
  }

  // Delete session
  await prisma.session.delete({
    where: { id: sessionId }
  });

  logger.info('Session revoked', {
    userId: req.user.id,
    sessionId
  });

  const response: ApiResponse = {
    success: true,
    message: 'Session revoked successfully'
  };

  res.json(response);
});

/**
 * Revoke all other sessions (keep current one)
 */
export const revokeAllOtherSessions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const currentToken = req.headers.authorization?.split(' ')[1];
  
  if (!currentToken) {
    throw createUnauthorizedError('No current session found');
  }

  // Find current session
  const currentRefreshToken = await prisma.refreshToken.findUnique({
    where: { token: currentToken }
  });

  // Get all sessions except current one
  const sessionsToRevoke = await prisma.session.findMany({
    where: {
      userId: req.user.id,
      isActive: true,
      ...(currentRefreshToken ? {
        refreshTokenId: {
          not: currentRefreshToken.id
        }
      } : {})
    },
    include: {
      refreshToken: true
    }
  });

  // Delete refresh tokens and sessions
  for (const session of sessionsToRevoke) {
    if (session.refreshTokenId && session.refreshToken) {
      await prisma.refreshToken.delete({
        where: { id: session.refreshTokenId }
      });
    }
    await prisma.session.delete({
      where: { id: session.id }
    });
  }

  logger.info('All other sessions revoked', {
    userId: req.user.id,
    revokedCount: sessionsToRevoke.length
  });

  const response: ApiResponse = {
    success: true,
    message: `Revoked ${sessionsToRevoke.length} session(s) successfully`
  };

  res.json(response);
});

/**
 * Update session activity timestamp
 */
export const updateSessionActivity = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const currentToken = req.headers.authorization?.split(' ')[1];
  
  if (currentToken) {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token: currentToken }
    });

    if (refreshToken) {
      await prisma.session.updateMany({
        where: {
          refreshTokenId: refreshToken.id,
          userId: req.user.id
        },
        data: {
          lastActivityAt: new Date()
        }
      });
    }
  }

  res.json({ success: true });
});

export default {
  getUserSessions,
  revokeSession,
  revokeAllOtherSessions,
  updateSessionActivity
};
