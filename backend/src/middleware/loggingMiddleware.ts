import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '@/config/logger';

// Extend Request interface to include requestId
declare global {
  namespace Express {
    interface Request {
      requestId: string;
      startTime: number;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Generate unique request ID
  req.requestId = uuidv4();
  req.startTime = Date.now();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.requestId);

  // Create logger with request context
  const requestLogger = logger.child({ requestId: req.requestId });

  // Log incoming request
  requestLogger.info('Incoming request', {
    method: req.method,
    url: req.url,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    query: req.query,
    ...(req.method !== 'GET' && { body: sanitizeBody(req.body) }),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (body: any) {
    const duration = Date.now() - req.startTime;

    requestLogger.info('Outgoing response', {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length'),
    });

    // Log error responses with more detail
    if (res.statusCode >= 400) {
      requestLogger.error('Error response', {
        statusCode: res.statusCode,
        response: sanitizeResponse(body),
      });
    }

    return originalJson.call(this, body);
  };

  next();
};

// Sanitize request body to remove sensitive information
const sanitizeBody = (body: any): any => {
  if (!body || typeof body !== 'object') return body;

  const sensitiveFields = ['password', 'confirmPassword', 'token', 'accessToken', 'refreshToken'];
  const sanitized = { ...body };

  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  });

  return sanitized;
};

// Sanitize response to remove sensitive information
const sanitizeResponse = (response: any): any => {
  if (!response || typeof response !== 'object') return response;

  const sensitiveFields = ['accessToken', 'refreshToken', 'passwordHash'];
  const sanitized = JSON.parse(JSON.stringify(response));

  const removeSensitiveFields = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(removeSensitiveFields);
    } else if (obj && typeof obj === 'object') {
      const cleaned = { ...obj };
      sensitiveFields.forEach(field => {
        if (cleaned[field]) {
          cleaned[field] = '[REDACTED]';
        }
      });

      // Recursively clean nested objects
      Object.keys(cleaned).forEach(key => {
        if (cleaned[key] && typeof cleaned[key] === 'object') {
          cleaned[key] = removeSensitiveFields(cleaned[key]);
        }
      });

      return cleaned;
    }
    return obj;
  };

  return removeSensitiveFields(sanitized);
};
