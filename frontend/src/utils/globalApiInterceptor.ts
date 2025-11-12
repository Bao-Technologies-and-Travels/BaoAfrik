// Store original fetch
const originalFetch = window.fetch;

// Override fetch
window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = input.toString();
  
  // Skip if not our API
  if (!url.includes(process.env.REACT_APP_API_URL!) || isAuthEndpoint(url)){
    return originalFetch(input, init);
  }
  
  // Check token
  const token = localStorage.getItem('accessToken');
  if (!token) {
    redirectToLogin();
    return Promise.reject(new Error('No token'));
  }
  
  // Validate token expiration
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      redirectToLogin();
      return Promise.reject(new Error('Token expired'));
    }
  } catch (error) {
    redirectToLogin();
    return Promise.reject(new Error('Invalid token'));
  }
  
// Authorization header
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    ...init?.headers,
  };
  
  const response = await originalFetch(input, { ...init, headers });
  
  // Handle 401 responses
  if (response.status === 401) {
    redirectToLogin();
    return Promise.reject(new Error('Authentication failed'));
  }
  
  return response;
};

const isAuthEndpoint = (url: string): boolean => {
  const authEndpoints = [
    '/',
    '/login',
    '/register',
    '/refresh',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/resend-verification',
    '/verify-reset-code',
    '/change-password'
  ];
  
  return authEndpoints.some(endpoint => url.includes(endpoint));
};

const redirectToLogin = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login?message=session_expired';
};

export {};