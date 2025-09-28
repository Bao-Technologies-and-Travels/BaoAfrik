"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOperationalError = exports.createTooManyRequestsError = exports.createConflictError = exports.createNotFoundError = exports.createForbiddenError = exports.createUnauthorizedError = exports.createValidationError = exports.createError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const createError = (message, statusCode = 500, code = 'INTERNAL_ERROR') => {
    return new AppError(message, statusCode, code);
};
exports.createError = createError;
const createValidationError = (message = 'Validation failed') => {
    return new AppError(message, 400, 'VALIDATION_ERROR');
};
exports.createValidationError = createValidationError;
const createUnauthorizedError = (message = 'Unauthorized') => {
    return new AppError(message, 401, 'UNAUTHORIZED');
};
exports.createUnauthorizedError = createUnauthorizedError;
const createForbiddenError = (message = 'Forbidden') => {
    return new AppError(message, 403, 'FORBIDDEN');
};
exports.createForbiddenError = createForbiddenError;
const createNotFoundError = (message = 'Resource not found') => {
    return new AppError(message, 404, 'NOT_FOUND');
};
exports.createNotFoundError = createNotFoundError;
const createConflictError = (message = 'Conflict') => {
    return new AppError(message, 409, 'CONFLICT');
};
exports.createConflictError = createConflictError;
const createTooManyRequestsError = (message = 'Too many requests') => {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS');
};
exports.createTooManyRequestsError = createTooManyRequestsError;
const isOperationalError = (error) => {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
};
exports.isOperationalError = isOperationalError;
//# sourceMappingURL=errorUtils.js.map