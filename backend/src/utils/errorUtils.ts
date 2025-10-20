export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Create standardized error
 */
export const createError = (message: string, statusCode: number = 500, code: string = 'INTERNAL_ERROR'): AppError => {
  return new AppError(message, statusCode, code);
};

/**
 * Common error creators
 */
export const createValidationError = (message: string = 'Validation failed'): AppError => {
  return new AppError(message, 400, 'VALIDATION_ERROR');
};

export const createUnauthorizedError = (message: string = 'Unauthorized'): AppError => {
  return new AppError(message, 401, 'UNAUTHORIZED');
};

export const createForbiddenError = (message: string = 'Forbidden'): AppError => {
  return new AppError(message, 403, 'FORBIDDEN');
};

export const createNotFoundError = (message: string = 'Resource not found'): AppError => {
  return new AppError(message, 404, 'NOT_FOUND');
};

export const createConflictError = (message: string = 'Conflict'): AppError => {
  return new AppError(message, 409, 'CONFLICT');
};

export const createTooManyRequestsError = (message: string = 'Too many requests'): AppError => {
  return new AppError(message, 429, 'TOO_MANY_REQUESTS');
};

export class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Check if error is operational (known error vs programming error)
 */
export const isOperationalError = (error: Error): boolean => {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
};
