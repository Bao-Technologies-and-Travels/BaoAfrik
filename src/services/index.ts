// Export all services for easy importing
export { apiClient } from './api';
export { authService } from './authService';
export { passwordResetService } from './passwordResetService';
export { marketplaceService } from './marketplaceService';

// Export types
export type {
  ApiResponse,
  User,
  AuthTokens,
  LoginResponse,
} from './api';

export type {
  Product,
  CreateProductData,
  Message,
  Conversation,
} from './marketplaceService';
