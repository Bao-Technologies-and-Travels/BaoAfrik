import { ApiResponse } from '../services/api';
import { API_ERROR_CODES, HTTP_STATUS } from './apiConfig';

// Error handling utilities
export interface AppError {
  code: string;
  message: string;
  field?: string;
  statusCode?: number;
}

export class ErrorHandler {
  // Convert API response errors to user-friendly messages
  static formatApiError(response: ApiResponse): AppError {
    const { message, errors } = response;
    
    // Handle validation errors
    if (errors && Object.keys(errors).length > 0) {
      const firstField = Object.keys(errors)[0];
      const fieldErrors = errors[firstField];
      const firstError = Array.isArray(fieldErrors) 
        ? fieldErrors[0] 
        : fieldErrors as string;
      
      return {
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: firstError,
        field: firstField,
        statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
      };
    }
    
    // Handle specific error codes
    return {
      code: 'UNKNOWN_ERROR',
      message: message || 'An unexpected error occurred',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    };
  }

  // Get user-friendly error messages
  static getUserMessage(error: AppError): string {
    switch (error.code) {
      case API_ERROR_CODES.UNAUTHORIZED:
        return 'Please sign in to continue';
      
      case API_ERROR_CODES.TOKEN_EXPIRED:
        return 'Your session has expired. Please sign in again';
      
      case API_ERROR_CODES.INVALID_CREDENTIALS:
        return 'Invalid email or password';
      
      case API_ERROR_CODES.EMAIL_NOT_VERIFIED:
        return 'Please verify your email address before continuing';
      
      case API_ERROR_CODES.DUPLICATE_EMAIL:
        return 'An account with this email already exists';
      
      case API_ERROR_CODES.WEAK_PASSWORD:
        return 'Password must be at least 8 characters with letters and numbers';
      
      case API_ERROR_CODES.NOT_FOUND:
        return 'The requested resource was not found';
      
      case API_ERROR_CODES.FORBIDDEN:
        return 'You do not have permission to perform this action';
      
      case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please try again later';
      
      case API_ERROR_CODES.FILE_TOO_LARGE:
        return 'File size is too large. Maximum size is 10MB';
      
      case API_ERROR_CODES.INVALID_FILE_TYPE:
        return 'Invalid file type. Only images are allowed';
      
      case API_ERROR_CODES.SERVICE_UNAVAILABLE:
        return 'Service is temporarily unavailable. Please try again later';
      
      default:
        return error.message || 'An unexpected error occurred';
    }
  }

  // Handle network errors
  static handleNetworkError(): AppError {
    return {
      code: 'NETWORK_ERROR',
      message: 'Network error. Please check your connection and try again',
      statusCode: 0,
    };
  }

  // Handle timeout errors
  static handleTimeoutError(): AppError {
    return {
      code: 'TIMEOUT_ERROR',
      message: 'Request timed out. Please try again',
      statusCode: 0,
    };
  }

  // Log errors for debugging
  static logError(error: AppError, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${context || 'API Error'}]:`, error);
    }
    
    // In production, you might want to send errors to a logging service
    // Example: Sentry, LogRocket, etc.
  }
}

// Error boundary helper
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context?: string
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = error instanceof Error 
      ? { code: 'UNKNOWN_ERROR', message: error.message }
      : ErrorHandler.handleNetworkError();
    
    ErrorHandler.logError(appError, context);
    return null;
  }
};
