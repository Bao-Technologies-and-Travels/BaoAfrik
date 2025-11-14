import { TokenManager } from "./tokenManager";

// Store original fetch
const originalFetch = window.fetch;

const isAuthEndpoint = (url: string): boolean => {
  const authEndpoints = [
    '/api/auth/register',
    '/api/auth/me',
    '/api/auth/login',
    '/api/auth/refresh',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
    '/api/auth/verify-reset-code',
    '/api/auth/change-password'
  ];

  const urlObj = new URL(url);
  const path = urlObj.pathname;

  const result = authEndpoints.some(endpoint => path === endpoint);
  return result;
};

const isRefreshEndpoint = (url: string): boolean => {
   const urlObj = new URL(url);
  const path = urlObj.pathname;
  const isRefresh = path === '/api/auth/refresh' || path === '/api/auth/refresh';
  return isRefresh;
}

const redirectToLogin = (): void => {
  TokenManager.clearTokens();
  localStorage.removeItem('user');
  window.location.href = '/login?message=session_expired';
};


// Override fetch
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input.toString();

  // Skip if not our API or is an auth endpoint
  const shouldSkip = !url.includes(process.env.REACT_APP_API_URL!) || isAuthEndpoint(url);

  if (shouldSkip) {
    return originalFetch(input, init);
  }

  // Check token
  let token = TokenManager.getAccessToken();

  // try to refresh if there is no token or token is expired
  if ((!token || TokenManager.isTokenExpired(token)) && !isRefreshEndpoint(url)) {
    try {
      token = await TokenManager.refreshToken();
    } catch (error) {
      redirectToLogin();
      return Promise.reject(new Error('Authentication failed'));
    }
  }

  if (!token) {
    redirectToLogin();
    return Promise.reject(new Error('No token'));
  }

  // Authorization header
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...init?.headers,
  };

  let response = await originalFetch(input, { ...init, headers });

  // Handle 401 responses by trying to refresh token
  if (response.status === 401 && !isRefreshEndpoint(url)) {
    try {
      // try to refresh the token
      const newToken = await TokenManager.refreshToken();

      // retry the original request with new token
      const retryHeaders = {
        ...headers,
        Authorization: `Bearer ${newToken}`,
      };

      response = await originalFetch(input, { ...init, headers: retryHeaders });
    } catch (error) {
      redirectToLogin();
      return Promise.reject(new Error('Authentication failed'));
    }
  }

  return response;
};

export { };