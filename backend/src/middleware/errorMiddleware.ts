import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
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
  error: Error | AppError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: any = {};

  // Log the error
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
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
  // Prisma Errors
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        statusCode = 409;
        message = 'Resource already exists';
        const target = error.meta?.target as string[];
        if (target?.includes('email')) {
          errors.email = 'An account with this email already exists';
        }
        break;
      case 'P2025':
        // Record not found
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        // Foreign key constraint violation
        statusCode = 400;
        message = 'Invalid reference to related resource';
        break;
      case 'P2014':
        // Invalid ID
        statusCode = 400;
        message = 'Invalid ID provided';
        break;
      default:
        statusCode = 500;
        message = 'Database error occurred';
        break;
    }
  }
  // Prisma Validation Error
  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  }
  // JWT Errors
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }
  // Validation Errors (from express-validator)
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }
  // Multer Errors (file upload)
  else if (error.name === 'MulterError') {
    statusCode = 400;
    if (error.message.includes('File too large')) {
      message = 'File size too large';
    } else if (error.message.includes('Unexpected field')) {
      message = 'Unexpected file field';
    } else {
      message = 'File upload error';
    }
  }
  // Rate Limit Errors
  else if (error.message.includes('Too many requests')) {
    statusCode = 429;
    message = 'Too many requests, please try again later';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong';
    errors = {};
  }

  const errorResponse = {
    success: false,
    message,
    ...(Object.keys(errors).length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack,
      originalError: error.message 
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

// Create specific error types
export const createValidationError = (message: string, field?: string) => {
  const error = new CustomError(message, 400);
  if (field) {
    (error as any).field = field;
  }
  return error;
};

export const createNotFoundError = (resource: string = 'Resource') => {
  return new CustomError(`${resource} not found`, 404);
};

export const createUnauthorizedError = (message: string = 'Unauthorized') => {
  return new CustomError(message, 401);
};

export const createForbiddenError = (message: string = 'Forbidden') => {
  return new CustomError(message, 403);
};

export const createConflictError = (message: string = 'Resource already exists') => {
  return new CustomError(message, 409);
};
