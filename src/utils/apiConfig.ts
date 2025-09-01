// API Configuration and Environment Variables
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  WS_URL: process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws',
  
  // Authentication
  TOKEN_STORAGE_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_STORAGE_KEY: 'user',
  
  // Request timeouts (in milliseconds)
  REQUEST_TIMEOUT: 30000,
  UPLOAD_TIMEOUT: 120000,
  
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  MAX_IMAGES_PER_PRODUCT: 10,
  
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Feature flags
  FEATURES: {
    SOCIAL_LOGIN: true,
    EMAIL_VERIFICATION: true,
    PASSWORD_RESET: true,
    FILE_UPLOAD: true,
    REAL_TIME_MESSAGING: true,
    PUSH_NOTIFICATIONS: false,
  },
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
      VERIFY_EMAIL: '/auth/verify-email',
      RESEND_VERIFICATION: '/auth/resend-verification',
      SOCIAL_LOGIN: '/auth/social-login',
      PROFILE: '/auth/profile',
      PROFILE_IMAGE: '/auth/profile/image',
      PREFERENCES: '/auth/preferences',
      CHANGE_PASSWORD: '/auth/change-password',
    },
    
    // Password Reset
    PASSWORD_RESET: {
      REQUEST: '/auth/forgot-password',
      VERIFY_CODE: '/auth/verify-reset-code',
      RESET: '/auth/reset-password',
      RESEND_CODE: '/auth/resend-reset-code',
    },
    
    // Products
    PRODUCTS: {
      LIST: '/products',
      CREATE: '/products',
      GET: '/products/:id',
      UPDATE: '/products/:id',
      DELETE: '/products/:id',
      SEARCH: '/products/search',
      MY_PRODUCTS: '/products/my-products',
      USER_PRODUCTS: '/products/user/:userId',
    },
    
    // Categories & Locations
    CATEGORIES: '/categories',
    LOCATIONS: '/locations',
    
    // Messaging
    MESSAGES: {
      CONVERSATIONS: '/messages/conversations',
      CONVERSATION: '/messages/conversations/:id',
      SEND: '/messages/send',
      READ: '/messages/:id/read',
      CONVERSATION_READ: '/messages/conversations/:id/read',
    },
    
    // Bookmarks
    BOOKMARKS: {
      LIST: '/bookmarks',
      ADD: '/bookmarks',
      REMOVE: '/bookmarks/:productId',
    },
    
    // Requests
    REQUESTS: {
      LIST: '/requests',
      CREATE: '/requests',
      GET: '/requests/:id',
      UPDATE: '/requests/:id',
      DELETE: '/requests/:id',
    },
    
    // Notifications
    NOTIFICATIONS: {
      LIST: '/notifications',
      READ: '/notifications/:id/read',
      READ_ALL: '/notifications/read-all',
    },
  },
};

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API Error Codes
export const API_ERROR_CODES = {
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_EMAIL: 'DUPLICATE_EMAIL',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  
  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  
  // Server errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // File upload errors
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
