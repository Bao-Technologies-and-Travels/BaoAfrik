// errorMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

// Import your AppError from errorUtils
import { AppError } from '@/utils/errorUtils';

export interface CustomError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Your existing CustomError class remains
export class CustomError extends Error implements CustomError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler - UPDATED VERSION
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';
  let errors: any = {};

  // Log the error
  logger.error('Error occurred:', {
    message: (error as any).message,
    stack: (error as any).stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle AppError from errorUtils (NEW)
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = (error as any).code || 'APP_ERROR';
  }
  // Handle CustomError
  else if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
    code = 'CUSTOM_ERROR';
  }
  // Handle errors with statusCode property
  else if (typeof error === 'object' && error !== null && (error as any).statusCode) {
    statusCode = (error as any).statusCode;
    message = (error as any).message || message;
  }

  // Rest of your existing error handling...
  else if ((error as any).errors) {
    errors = (error as any).errors;
  }
  // Prisma Known Request Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        code = 'CONFLICT';
        const target = prismaError.meta?.target as string[];
        if (target?.includes('email')) {
          errors.email = 'An account with this email already exists';
        }
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        code = 'NOT_FOUND';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related resource';
        code = 'INVALID_REFERENCE';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid ID provided';
        code = 'INVALID_ID';
        break;
      default:
        statusCode = 500;
        message = 'Database error occurred';
        code = 'DATABASE_ERROR';
        break;
    }
  }
  // JWT Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  }
  else if (typeof error === 'object' && error !== null && (error as any).name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  }
  // Validation Errors (express-validator)
  else if (typeof error === 'object' && error !== null && (error as any).name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  }
  // Multer Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'MulterError') {
    statusCode = 400;
    code = 'FILE_UPLOAD_ERROR';
    const errMessage = (error as any).message || '';
    if (errMessage.includes('File too large')) {
      message = 'File size too large';
    } else if (errMessage.includes('Unexpected field')) {
      message = 'Unexpected file field';
    } else {
      message = 'File upload error';
    }
  }
  // Rate Limit
  else if (typeof error === 'object' && error !== null && (error as any).message?.includes('Too many requests')) {
    statusCode = 429;
    message = 'Too many requests, please try again later';
    code = 'RATE_LIMIT_EXCEEDED';
  }

  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
    errors = {};
  }

  const errorResponse = {
    success: false,
    message,
    code,
    ...(Object.keys(errors).length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: (error as any).stack,
      originalError: (error as any).message
    }),
  };

  res.status(statusCode).json(errorResponse);
};

export { 
  createValidationError, 
  createNotFoundError, 
  createUnauthorizedError, 
  createForbiddenError, 
  createConflictError 
} from '@/utils/errorUtils';

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};