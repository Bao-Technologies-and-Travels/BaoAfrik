import axios from 'axios';
import logger from '@/config/logger';

interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

interface OAuthUserInfo {
  id: string;
  email?: string;
  name?: string;
}

/**
 * Exchange Facebook authorization code for access token
 */
export async function exchangeFacebookToken(
  code: string,
  redirectUri: string
): Promise<{ tokens: OAuthTokenResponse; userInfo: OAuthUserInfo }> {
  const clientId = process.env.FACEBOOK_APP_ID;
  const clientSecret = process.env.FACEBOOK_APP_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Facebook OAuth credentials not configured');
  }

  logger.info('Exchanging Facebook authorization code for token', { redirectUri });

  // Exchange code for access token
  const tokenResponse = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
    params: {
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code
    }
  }).catch((error: any) => {
    logger.error('Facebook token exchange failed', {
      error: error.response?.data || error.message,
      status: error.response?.status
    });
    throw new Error(`Facebook token exchange failed: ${error.response?.data?.error?.message || error.message}`);
  });

  const accessToken = tokenResponse.data.access_token;

  // Get user info
  const userResponse = await axios.get('https://graph.facebook.com/v18.0/me', {
    params: {
      access_token: accessToken,
      fields: 'id,name,email'
    }
  });

  return {
    tokens: {
      access_token: accessToken,
      expires_in: tokenResponse.data.expires_in
    },
    userInfo: {
      id: userResponse.data.id,
      email: userResponse.data.email,
      name: userResponse.data.name
    }
  };
}

/**
 * Exchange Instagram authorization code for access token
 */
export async function exchangeInstagramToken(
  code: string,
  redirectUri: string
): Promise<{ tokens: OAuthTokenResponse; userInfo: OAuthUserInfo }> {
  const clientId = process.env.INSTAGRAM_APP_ID;
  const clientSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Instagram OAuth credentials not configured');
  }

  logger.info('Exchanging Instagram authorization code for token', { redirectUri });

  // Exchange code for access token
  // Instagram Basic Display API requires form-urlencoded body
  const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token',
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  ).catch((error: any) => {
    logger.error('Instagram token exchange failed', {
      error: error.response?.data || error.message,
      status: error.response?.status
    });
    throw new Error(`Instagram token exchange failed: ${error.response?.data?.error_message || error.response?.data?.error?.message || error.message}`);
  });

  const accessToken = tokenResponse.data.access_token;
  const userId = tokenResponse.data.user_id;

  // Get user info
  const userResponse = await axios.get(`https://graph.instagram.com/${userId}`, {
    params: {
      access_token: accessToken,
      fields: 'id,username'
    }
  });

  return {
    tokens: {
      access_token: accessToken,
      expires_in: tokenResponse.data.expires_in
    },
    userInfo: {
      id: userResponse.data.id,
      name: userResponse.data.username
    }
  };
}

/**
 * Exchange LinkedIn authorization code for access token
 */
export async function exchangeLinkedInToken(
  code: string,
  redirectUri: string
): Promise<{ tokens: OAuthTokenResponse; userInfo: OAuthUserInfo }> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('LinkedIn OAuth credentials not configured');
  }

  // Exchange code for access token
  // LinkedIn requires form-urlencoded body, not query params
  const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken',
    new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  const accessToken = tokenResponse.data.access_token;

  // Get user info using OpenID Connect (new LinkedIn API)
  const userResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return {
    tokens: {
      access_token: accessToken,
      expires_in: tokenResponse.data.expires_in
    },
    userInfo: {
      id: userResponse.data.sub || userResponse.data.id,
      email: userResponse.data.email,
      name: userResponse.data.name || `${userResponse.data.given_name || ''} ${userResponse.data.family_name || ''}`.trim()
    }
  };
}

/**
 * Exchange X (Twitter) authorization code for access token
 */
export async function exchangeXToken(
  code: string,
  redirectUri: string,
  codeVerifier: string
): Promise<{ tokens: OAuthTokenResponse; userInfo: OAuthUserInfo }> {
  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('X OAuth credentials not configured');
  }

  logger.info('Exchanging X authorization code for token', { redirectUri, hasCodeVerifier: !!codeVerifier });

  // Exchange code for access token
  // X/Twitter requires form-urlencoded body with Basic Auth
  // Build request body - only include code_verifier if provided
  const requestBody = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId
  });

  if (codeVerifier) {
    requestBody.append('code_verifier', codeVerifier);
  }

  const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token',
    requestBody,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      }
    }
  ).catch((error: any) => {
    logger.error('X token exchange failed', {
      error: error.response?.data || error.message,
      status: error.response?.status
    });
    const errorMsg = error.response?.data?.error_description || error.response?.data?.error || error.message;
    throw new Error(`X token exchange failed: ${errorMsg}. ${codeVerifier ? '' : 'Note: X OAuth 2.0 may require PKCE (code_verifier).'}`);
  });

  const accessToken = tokenResponse.data.access_token;

  // Get user info
  const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    params: {
      'user.fields': 'id,name,username,email'
    }
  });

  return {
    tokens: {
      access_token: accessToken,
      refresh_token: tokenResponse.data.refresh_token,
      expires_in: tokenResponse.data.expires_in
    },
    userInfo: {
      id: userResponse.data.data.id,
      email: userResponse.data.data.email,
      name: userResponse.data.data.name || userResponse.data.data.username
    }
  };
}
