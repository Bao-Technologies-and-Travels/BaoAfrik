"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConflictError = exports.createForbiddenError = exports.createUnauthorizedError = exports.createNotFoundError = exports.createValidationError = exports.asyncHandler = exports.errorHandler = exports.notFound = exports.CustomError = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("@/config/logger"));
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
const notFound = (req, res, next) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = {};
    logger_1.default.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    if (error instanceof CustomError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                statusCode = 409;
                message = 'Resource already exists';
                const target = error.meta?.target;
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
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid data provided';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }
    else if (error.name === 'MulterError') {
        statusCode = 400;
        if (error.message.includes('File too large')) {
            message = 'File size too large';
        }
        else if (error.message.includes('Unexpected field')) {
            message = 'Unexpected file field';
        }
        else {
            message = 'File upload error';
        }
    }
    else if (error.message.includes('Too many requests')) {
        statusCode = 429;
        message = 'Too many requests, please try again later';
    }
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
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const createValidationError = (message, field) => {
    const error = new CustomError(message, 400);
    if (field) {
        error.field = field;
    }
    return error;
};
exports.createValidationError = createValidationError;
const createNotFoundError = (resource = 'Resource') => {
    return new CustomError(`${resource} not found`, 404);
};
exports.createNotFoundError = createNotFoundError;
const createUnauthorizedError = (message = 'Unauthorized') => {
    return new CustomError(message, 401);
};
exports.createUnauthorizedError = createUnauthorizedError;
const createForbiddenError = (message = 'Forbidden') => {
    return new CustomError(message, 403);
};
exports.createForbiddenError = createForbiddenError;
const createConflictError = (message = 'Resource already exists') => {
    return new CustomError(message, 409);
};
exports.createConflictError = createConflictError;
//# sourceMappingURL=errorMiddleware.js.map