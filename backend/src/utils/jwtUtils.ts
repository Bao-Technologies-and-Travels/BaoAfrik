import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { createError } from '@/utils/errorUtils';

// ---- types you actually return in tokens ----
export type TokenPayload = {
  userId: string;
  email: string;
};

// ---- env helpers: make secrets NON-optional at type & runtime ----
function requiredEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) throw new Error(`Missing required env var ${name}`);
  return v;
}

// Secrets as strings
const JWT_SECRET = requiredEnv('JWT_SECRET');
const JWT_REFRESH_SECRET = requiredEnv('JWT_REFRESH_SECRET');

// Token expiration times - explicitly type as string for jwt.sign
const ACCESS_TTL: string = process.env.JWT_EXPIRE_TIME ?? '15m';
const REFRESH_TTL: string = process.env.JWT_REFRESH_EXPIRE_TIME ?? '7d';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ---- signers ----
export function signAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TTL as any,
    algorithm: 'HS256'
  });
}

export function signRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TTL as any,
    algorithm: 'HS256'
  });
}

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (userId: string, email: string): TokenPair => {
  const payload: TokenPayload = { userId, email };

  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

// ---- verifiers (narrow the union, no blind casts) ----
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') throw new Error('Invalid access token payload');
    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('Access token expired', 401, 'TOKEN_EXPIRED');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError('Invalid access token', 401, 'INVALID_TOKEN');
    }
    throw createError('Token verification failed', 401, 'TOKEN_VERIFICATION_FAILED');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    if (typeof decoded === 'string') throw new Error('Invalid refresh token payload');
    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw createError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw createError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
    throw createError('Refresh token verification failed', 401, 'REFRESH_TOKEN_VERIFICATION_FAILED');
  }
}

/**
 * Generate secure random token for email verification, password reset, etc.
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generate 6-digit verification code
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// ---- optional: only if you really need to parse "15m" -> seconds ----
// Keep or remove. If you use it, guard match indices.
export function parseDurationToSeconds(input: string): number {
  const match = /^(\d+)([smhd])$/.exec(input);
  if (!match || !match[1] || !match[2]) {
    throw new Error(`Invalid duration: ${input}`);
  }
  const amount = parseInt(match[1], 10);
  const unit = match[2] as 's' | 'm' | 'h' | 'd';
  const mult = { s: 1, m: 60, h: 3600, d: 86400 }[unit];
  return amount * mult;
}
