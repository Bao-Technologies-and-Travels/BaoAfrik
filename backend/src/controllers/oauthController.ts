import { Request, Response } from 'express';
import prisma from '@/config/database';
import { asyncHandler } from '@/middleware/errorMiddleware';
import { createUnauthorizedError, createValidationError } from '@/middleware/errorMiddleware';
import { ApiResponse } from '@/types/auth';
import logger from '@/config/logger';
import {
  exchangeFacebookToken,
  exchangeInstagramToken,
  exchangeLinkedInToken,
  exchangeXToken
} from '@/services/oauthService';

/**
 * Initiate Facebook OAuth connection
 */
export const initiateFacebookOAuth = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    throw createValidationError('Redirect URI is required');
  }

  // Facebook OAuth configuration
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = redirect_uri as string;

  if (!clientId) {
    throw new Error('Facebook App ID not configured');
  }

  // Facebook OAuth URL
  // Redirect URI should point to backend callback endpoint
  // Use the redirect_uri from query if provided, otherwise use backend callback
  const backendCallbackUri = redirectUri || `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback?provider=facebook`;
  const scope = 'email,public_profile';
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(backendCallbackUri)}&scope=${scope}&response_type=code&state=${req.user.id}`;

  logger.info('Facebook OAuth initiated', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    data: {
      authUrl
    }
  };

  res.json(response);
});

/**
 * Initiate Instagram OAuth connection
 */
export const initiateInstagramOAuth = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    throw createValidationError('Redirect URI is required');
  }

  // Instagram OAuth configuration
  const clientId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = redirect_uri as string;

  if (!clientId) {
    throw new Error('Instagram App ID not configured');
  }

  // Instagram Basic Display API OAuth URL
  // Use the exact redirect URI provided (must match registered URI exactly)
  const backendCallbackUri = redirectUri || `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback?provider=instagram`;
  const scope = 'user_profile,user_media';
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(backendCallbackUri)}&scope=${scope}&response_type=code&state=${req.user.id}`;

  logger.info('Instagram OAuth initiated', {
    userId: req.user.id,
    redirectUri: backendCallbackUri
  });


  const response: ApiResponse = {
    success: true,
    data: {
      authUrl
    }
  };

  res.json(response);
});

/**
 * Initiate LinkedIn OAuth connection
 */
export const initiateLinkedInOAuth = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    throw createValidationError('Redirect URI is required');
  }

  // LinkedIn OAuth configuration
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = redirect_uri as string;

  if (!clientId) {
    throw new Error('LinkedIn Client ID not configured');
  }

  // LinkedIn OAuth URL
  // Use the exact redirect URI provided (must match registered URI exactly)
  const backendCallbackUri = redirectUri || `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback?provider=linkedin`;
  // LinkedIn now uses openid profile email scopes (deprecated r_liteprofile)
  const scope = 'openid profile email';
  const state = req.user.id;
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(backendCallbackUri)}&state=${state}&scope=${encodeURIComponent(scope)}`;

  logger.info('LinkedIn OAuth initiated', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    data: {
      authUrl
    }
  };

  res.json(response);
});

/**
 * Initiate X (Twitter) OAuth connection
 */
export const initiateXOAuth = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw createUnauthorizedError('User not authenticated');
  }

  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    throw createValidationError('Redirect URI is required');
  }

  // X (Twitter) OAuth configuration
  const clientId = process.env.X_CLIENT_ID;
  const redirectUri = redirect_uri as string;

  if (!clientId) {
    throw new Error('X Client ID not configured');
  }

  // X OAuth 2.0 URL
  // Use the exact redirect URI provided
  const backendCallbackUri = redirectUri || `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback?provider=x`;
  const scope = 'tweet.read users.read offline.access';
  const state = req.user.id;
  // For X/Twitter, we need to use PKCE. For now, we'll use a simple approach without PKCE
  // Note: X/Twitter OAuth 2.0 requires PKCE for security. This is a simplified version.
  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(backendCallbackUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;

  logger.info('X OAuth initiated', {
    userId: req.user.id
  });

  const response: ApiResponse = {
    success: true,
    data: {
      authUrl
    }
  };

  res.json(response);
});

/**
 * Handle OAuth callback and connect social account
 * This endpoint receives the OAuth code, exchanges it for tokens, and connects the account
 */
export const handleOAuthCallback = asyncHandler(async (req: Request, res: Response) => {
  const { provider, code, state, error } = req.query;

  // Handle OAuth errors
  if (error) {
    const errorDescription = req.query.error_description || 'OAuth authorization was denied or failed';
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/social-account-callback?error=${encodeURIComponent(error as string)}&error_description=${encodeURIComponent(errorDescription as string)}`;
    return res.redirect(redirectUri);
  }

  if (!provider || !code || !state) {
    throw createValidationError('Missing required OAuth parameters');
  }

  const userId = state as string;
  const providerName = (provider as string).toLowerCase();

  // Validate provider
  const VALID_PROVIDERS = ['facebook', 'instagram', 'linkedin', 'x'];
  if (!VALID_PROVIDERS.includes(providerName)) {
    throw createValidationError(`Invalid provider: ${providerName}`);
  }

  // Verify user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw createValidationError('Invalid user state');
  }

  try {
    // Get redirect URI from the OAuth provider callback
    // The redirect URI must match EXACTLY what was used in the OAuth initiation
    // Construct it based on the provider and current request
    const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    const backendCallbackUri = currentUrl.includes('provider=')
      ? currentUrl
      : `${process.env.API_URL || process.env.BACKEND_URL || 'http://localhost:3001'}/api/auth/callback?provider=${providerName}`;

    logger.info('Processing OAuth callback', {
      provider: providerName,
      userId: userId,
      redirectUri: backendCallbackUri,
      hasCode: !!code
    });

    // Exchange authorization code for access token based on provider
    let tokens: { access_token: string; refresh_token?: string; expires_in?: number };
    let userInfo: { id: string; email?: string; name?: string };

    switch (providerName) {
      case 'facebook':
        ({ tokens, userInfo } = await exchangeFacebookToken(code as string, backendCallbackUri));
        break;
      case 'instagram':
        ({ tokens, userInfo } = await exchangeInstagramToken(code as string, backendCallbackUri));
        break;
      case 'linkedin':
        ({ tokens, userInfo } = await exchangeLinkedInToken(code as string, backendCallbackUri));
        break;
      case 'x':
        // X/Twitter OAuth 2.0 requires PKCE, but for simplicity, we'll try without code_verifier first
        // If this fails, you'll need to implement proper PKCE flow
        try {
          ({ tokens, userInfo } = await exchangeXToken(code as string, backendCallbackUri, ''));
        } catch (error: any) {
          // If PKCE is required, log the error and provide helpful message
          logger.error('X OAuth token exchange failed - may require PKCE', { error: error.message });
          throw new Error('X OAuth requires PKCE implementation. Please configure PKCE in your X app settings or implement proper PKCE flow.');
        }
        break;
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }

    // Calculate token expiration
    const tokenExpiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : undefined;

    // Connect social account
    await prisma.socialAccount.upsert({
      where: {
        userId_provider: {
          userId: userId,
          provider: providerName
        }
      },
      create: {
        userId: userId,
        provider: providerName,
        providerId: userInfo.id,
        providerEmail: userInfo.email || null,
        providerName: userInfo.name || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenExpiresAt: tokenExpiresAt || null,
        isConnected: true
      },
      update: {
        providerId: userInfo.id,
        providerEmail: userInfo.email || null,
        providerName: userInfo.name || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
        tokenExpiresAt: tokenExpiresAt || null,
        isConnected: true
      }
    });

    logger.info('Social account connected via OAuth', {
      userId: userId,
      provider: providerName
    });

    // Redirect to frontend with success
    const successRedirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/social-account-callback?provider=${providerName}&success=true`;
    res.redirect(successRedirectUri);
  } catch (error: any) {
    logger.error('OAuth token exchange failed', {
      provider: providerName,
      userId: userId,
      error: error.message,
      stack: error.stack
    });

    // Provide more detailed error message
    const errorMessage = error.message || 'Unknown error occurred';
    const redirectUri = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/social-account-callback?error=token_exchange_failed&error_description=${encodeURIComponent(errorMessage)}`;
    res.redirect(redirectUri);
  }
});

export default {
  initiateFacebookOAuth,
  initiateInstagramOAuth,
  initiateLinkedInOAuth,
  initiateXOAuth,
  handleOAuthCallback
};
