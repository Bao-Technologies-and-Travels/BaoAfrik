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

const isPublicEndpoint = (url: string, method: string = 'GET'): boolean => {
  try {
    const urlObj = new URL(url, window.location.origin);
    const path = urlObj.pathname;

    // For GET requests, allow public access to these endpoints
    if (method === 'GET') {
      // Allow GET /api/products (listings) - public
      if (path === '/api/products' || path.startsWith('/api/products?')) {
        return true;
      }
      // Allow GET /api/products/:id or /products/:id (view product details) - public
      // But exclude authenticated endpoints like /save, /saved, /view (POST)
      const productDetailPath = path.match(/^\/api\/products\/[^/]+$/) || path.match(/^\/products\/[^/]+$/);
      if (productDetailPath &&
          !path.includes('/save') &&
          !path.includes('/saved') &&
          !path.includes('/view') &&
          !path.includes('/my-products')) {
        return true;
      }
      // Allow GET /api/categories - public
      if (path === '/api/categories' || path.startsWith('/api/categories/')) {
        return true;
      }
      // Allow GET /api/requests (public requests listing) - public
      if (path === '/api/requests' || path.startsWith('/api/requests?')) {
        return true;
      }
    }

    // Always public endpoints (all methods)
    const alwaysPublicEndpoints = [
      '/api/upload' // Upload might be public in some cases
    ];
    
    if (alwaysPublicEndpoints.some(endpoint => path === endpoint || path.startsWith(endpoint + '/'))) {
      return true;
    }

    return false;
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
    const method = (init?.method || 'GET').toUpperCase();

    // Skip non-API and public/auth endpoints
    const isOurApi = urlString.includes(process.env.REACT_APP_API_URL || '');
    const isAuth = isAuthEndpoint(urlString);
    const isPublic = isPublicEndpoint(urlString, method);
    const shouldSkip = !isOurApi || isAuth || isPublic;

    if (shouldSkip) {
      return window.__originalFetch!.call(window, input, init);
    }

    // Skip for visitor mode
    if (localStorage.getItem('isVisitor') === 'true') {
      return window.__originalFetch!.call(window, input, init);
    }

    // Check if we're on a public page where unauthenticated access is allowed
    const pathname = window.location.pathname;
    const isHomePage = pathname === '/' || pathname === '/home';
    const isProductDetailPage = /^\/product\/[^/]+$/.test(pathname);
    const isPublicPage = isHomePage || isProductDetailPage;

    // Check token
    const token = TokenManager.getAccessToken();
    const isExpired = token ? TokenManager.isTokenExpired(token) : true;

    // If on homepage or product detail and no token, allow the request without auth header (don't redirect)
    // This allows users to browse the homepage and view product details without logging in
    if (isPublicPage && (!token || isExpired)) {
      return window.__originalFetch!.call(window, input, init);
    }

    // Handle missing/expired token - only redirect if not on homepage
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

      // Handle 401 responses - don't redirect on public pages (home, product detail)
      if (response.status === 401) {
        const currentPath = window.location.pathname;
        const isHome = currentPath === '/' || currentPath === '/home';
        const isProductDetail = /^\/product\/[^/]+$/.test(currentPath);
        if (!isHome && !isProductDetail) {
          console.log('Received 401, redirecting to login');
          return redirectToLogin();
        }
        // On homepage or product detail, return 401 without redirecting so the page can handle it
      }

      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof Error &&
        (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        const currentPath = window.location.pathname;
        const isHome = currentPath === '/' || currentPath === '/home';
        const isProductDetail = /^\/product\/[^/]+$/.test(currentPath);
        if (!isHome && !isProductDetail) {
          return redirectToLogin();
        }
        // On homepage or product detail, re-throw so the component can handle it
      }
      throw error;
    }
  };
}

export { };