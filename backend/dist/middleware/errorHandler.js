"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (err, _req, res, _next) => {
    // Default to 500 if status code not set
    const statusCode = err.status || 500;
    // Log the error
    logger_1.logger.error({
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
exports.errorHandler = errorHandler;
