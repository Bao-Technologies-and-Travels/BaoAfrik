import { TokenManager } from "./tokenManager";

declare global {
  interface Window {
    __originalFetch?: typeof fetch;
  }
}

const isAuthEndpoint = (url: string): boolean => {
  const authEndpoints = [
    '/api/auth/register',
    '/api/auth/login',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
    '/api/auth/verify-email',
    '/api/auth/resend-verification',
    '/api/auth/verify-reset-code',
    '/api/auth/change-password'
  ];

  try {
    const urlObj = new URL(url, window.location.origin);
    return authEndpoints.some(endpoint => urlObj.pathname === endpoint);
  } catch (e) {
    console.error('Error checking auth endpoint:', e);
    return false;
  }
};

const isPublicEndpoint = (url: string): boolean => {
  const publicEndpoints = [
    '/api/products',
    '/api/categories',
    '/api/chat',
    '/api/upload'
  ];

  try {
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;

    return publicEndpoints.some(endpoint =>
      path === endpoint ||
      (path.startsWith(endpoint + '/') && endpoint !== '/')
    );
  } catch (e) {
    console.error('Error checking public endpoint:', e);
    return false;
  }
};

const redirectToLogin = (): Promise<never> => {
  // Clear tokens and user data
  TokenManager.clearTokens();
  localStorage.removeItem('user');

  // Store current path for post-login redirect
  const currentPath = window.location.pathname + window.location.search;
  if (!currentPath.includes('/login')) {
    localStorage.setItem('redirectAfterLogin', currentPath);
  }

  // Redirect to login with session expired message
  window.location.href = `/login?message=session_expired&redirect=${encodeURIComponent(currentPath)}`;

  // Return a never-resolving promise to block further processing
  return new Promise(() => { });
};

const getUrlString = (input: RequestInfo | URL): string => {
  try {
    if (typeof input === 'string') return input;
    if (input instanceof URL) return input.toString();
    if (input && typeof input === 'object' && 'url' in input) return input.url;
    return '';
  } catch (e) {
    console.error('Error parsing URL:', e);
    return '';
  }
};

// Only initialize once
if (!window.__originalFetch) {
  // Store original fetch
  window.__originalFetch = window.fetch;

  // Override global fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString = getUrlString(input);

    // Skip non-API and public/auth endpoints
    const isOurApi = urlString.includes(process.env.REACT_APP_API_URL || '');
    const isAuth = isAuthEndpoint(urlString);
    const isPublic = isPublicEndpoint(urlString);
    const shouldSkip = !isOurApi || isAuth || isPublic;

    if (shouldSkip) {
      return window.__originalFetch!.call(window, input, init);
    }

    // Skip for visitor mode
    if (localStorage.getItem('isVisitor') === 'true') {
      return window.__originalFetch!.call(window, input, init);
    }

    // Check token
    const token = TokenManager.getAccessToken();
    const isExpired = token ? TokenManager.isTokenExpired(token) : true;

    // Handle missing/expired token
    if (!token || isExpired) {
      console.log('Token missing or expired, redirecting to login');
      return redirectToLogin();
    }

    // Add auth header
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${token}`);

    try {
      const response = await window.__originalFetch!.call(window, input, {
        ...init,
        headers,
        credentials: 'include'
      });

      // Handle 401 responses
      if (response.status === 401) {
        console.log('Received 401, redirecting to login');
        return redirectToLogin();
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error &&
        (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        return redirectToLogin();
      }
      throw error;
    }
  };
}

export { };