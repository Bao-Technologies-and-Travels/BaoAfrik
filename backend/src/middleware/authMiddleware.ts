import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '@/utils/asyncHandler';
import { createUnauthorizedError, createForbiddenError } from '@/utils/errorUtils';
import logger from '@/config/logger';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        profileImage?: string | null;  // Allow null for profileImage
        isVerifiedSeller: boolean;
        emailVerified?: boolean;  // Add this line to match the user object from Prisma
      };
    }
  }
}

// Verify JWT token and set user in request
export const authenticateToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw createUnauthorizedError('Access token is required');
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    // Fetch user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        isVerifiedSeller: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw createUnauthorizedError('User not found or inactive');
    }

    if (!user.emailVerified) {
      throw createUnauthorizedError('Email verification required');
    }

    // Add user to request object
    req.user = user;
    
    logger.info('User authenticated successfully', { 
      userId: user.id, 
      email: user.email,
      requestId: req.requestId,
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createUnauthorizedError('Invalid access token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw createUnauthorizedError('Access token expired');
    } else {
      throw error;
    }
  }
});

// Optional authentication - doesn't throw error if no token
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // No token provided, continue without user
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(); // JWT not configured, continue without user
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        isActive: true,
        emailVerified: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        isVerifiedSeller: true,
      },
    });

    if (user) {
      req.user = user;
      logger.info('Optional auth: User authenticated', { 
        userId: user.id,
        requestId: req.requestId,
      });
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
    logger.debug('Optional auth failed', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId: req.requestId,
    });
  }

  next();
});

// Require verified seller status
export const requireVerifiedSeller = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw createUnauthorizedError('Authentication required');
  }

  if (!req.user.isVerifiedSeller) {
    throw createForbiddenError('Verified seller status required');
  }

  next();
};

// Require user to own the resource (for user-specific endpoints)
export const requireResourceOwnership = (resourceUserIdField: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw createUnauthorizedError('Authentication required');
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user.id !== resourceUserId) {
      throw createForbiddenError('Access denied: You can only access your own resources');
    }

    next();
  };
};

