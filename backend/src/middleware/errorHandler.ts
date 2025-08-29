import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface HttpError extends Error {
  status?: number;
  code?: string;
  errors?: any[];
}

export const errorHandler = (
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Default to 500 if status code not set
  const statusCode = err.status || 500;
  
  // Log the error
  logger.error({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code,
    errors: err.errors,
  });

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    return res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }

  // Return error details in development
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      code: err.code,
      errors: err.errors,
    }),
  });
};
