import { Request, Response, NextFunction } from 'express';
import logger from '@/config/logger';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
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

  // Custom App Error
  if (error instanceof CustomError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  if ((error as any).errors) {
    errors = (error as any).errors;
  }

  // Prisma Known Request Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'PrismaClientKnownRequestError') {
    const prismaError = error as any;
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        const target = prismaError.meta?.target as string[];
        if (target?.includes('email')) {
          errors.email = 'An account with this email already exists';
        }
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related resource';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid ID provided';
        break;
      default:
        statusCode = 500;
        message = 'Database error occurred';
        break;
    }
  }
  // JWT Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (typeof error === 'object' && error !== null && (error as any).name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Validation Errors (express-validator)
  else if (typeof error === 'object' && error !== null && (error as any).name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }
  // Multer Errors
  else if (typeof error === 'object' && error !== null && (error as any).name === 'MulterError') {
    statusCode = 400;
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
  }

  // Don't leak details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
    errors = {};
  }

  const errorResponse = {
    success: false,
    message,
    ...(Object.keys(errors).length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: (error as any).stack,
      originalError: (error as any).message
    }),
  };

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Specific error creators
export const createValidationError = (message: string, field?: string) => {
  const error = new CustomError(message, 400);
  if (field) (error as any).field = field;
  return error;
};
export const createNotFoundError = (resource: string = 'Resource') => new CustomError(`${resource} not found`, 404);
export const createUnauthorizedError = (message: string = 'Unauthorized') => new CustomError(message, 401);
export const createForbiddenError = (message: string = 'Forbidden') => new CustomError(message, 403);
export const createConflictError = (message: string = 'Resource already exists') => new CustomError(message, 409);