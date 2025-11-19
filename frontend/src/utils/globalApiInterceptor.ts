import { TokenManager } from "./tokenManager";

// Store original fetch
const originalFetch = window.fetch;

const isAuthEndpoint = (url: string): boolean => {
  const authEndpoints = [
    '/api/auth/register',
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

const isPublicEndpoint = (url: string): boolean => {
  const publicEndpoints = [
    '/api/products',
    '/api/categories',
    '/api/chat',
    '/api/upload',
  ];

  const urlObj = new URL (url);
  const path = urlObj.pathname;

  const result = publicEndpoints.some(endpoint => path.startsWith(endpoint));
  return result;
}

const redirectToLogin = (): void => {
  TokenManager.clearTokens();
  localStorage.removeItem('user');
  window.location.href = '/login?message=session_expired';
};

// Override fetch
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input.toString();

  // Skip if not our API or is an auth endpoint or is a public endpoint
  const shouldSkip = !url.includes(process.env.REACT_APP_API_URL!) || isAuthEndpoint(url) || isPublicEndpoint(url);

  if (shouldSkip) {
    return originalFetch(input, init);
  }

  // check if user is in visitor mode
  const isVisitor = localStorage.getItem('isVisitor') === 'true';
  if(isVisitor){
    return originalFetch(input, init)
  }

  // Check token
  let token = TokenManager.getAccessToken();

  if(!token && !isVisitor) {
    redirectToLogin();
    return Promise.reject(new Error('Authentication required'));
  }

  // try to refresh if there is no token or token is expired
  if ((!token || TokenManager.isTokenExpired(token)) && !isRefreshEndpoint(url)) {
    try {
      token = await TokenManager.refreshToken();
    } catch (error) {
      if(!isVisitor) {
        redirectToLogin();
      return Promise.reject(new Error('Authentication failed'));
      }
    }
  }

  if (!token && !isVisitor) {
    redirectToLogin();
    return Promise.reject(new Error('No token'));
  }

  // create headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // merge with existing headers
  if(init?.headers) {
    if(init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.entries(init.headers).forEach(([key, value]) => {
        headers[key] = value as string;
      });
    }
  }

  // add Authorization header if there is an accessToken and not in visitor mode 
  if(token && !isVisitor) {
    headers.Authorization = `Bearer ${token}`;
  }

  // create new init object with merged headers
  const newInit: RequestInit = {
    ...init,
    headers
  };

  let response = await originalFetch(input, newInit);

  // Handle 401 responses by trying to refresh token
  if (response.status === 401 && !isRefreshEndpoint(url) && !isVisitor) {
    try {
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