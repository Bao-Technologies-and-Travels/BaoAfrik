"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("@/config/logger"));
const requestLogger = (req, res, next) => {
    req.requestId = (0, uuid_1.v4)();
    req.startTime = Date.now();
    res.setHeader('X-Request-ID', req.requestId);
    const requestLogger = logger_1.default.child({ requestId: req.requestId });
    requestLogger.info('Incoming request', {
        method: req.method,
        url: req.url,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
        query: req.query,
        ...(req.method !== 'GET' && { body: sanitizeBody(req.body) }),
    });
    const originalJson = res.json;
    res.json = function (body) {
        const duration = Date.now() - req.startTime;
        requestLogger.info('Outgoing response', {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get('content-length'),
        });
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
exports.requestLogger = requestLogger;
const sanitizeBody = (body) => {
    if (!body || typeof body !== 'object')
        return body;
    const sensitiveFields = ['password', 'confirmPassword', 'token', 'accessToken', 'refreshToken'];
    const sanitized = { ...body };
    sensitiveFields.forEach(field => {
        if (sanitized[field]) {
            sanitized[field] = '[REDACTED]';
        }
    });
    return sanitized;
};
const sanitizeResponse = (response) => {
    if (!response || typeof response !== 'object')
        return response;
    const sensitiveFields = ['accessToken', 'refreshToken', 'passwordHash'];
    const sanitized = JSON.parse(JSON.stringify(response));
    const removeSensitiveFields = (obj) => {
        if (Array.isArray(obj)) {
            return obj.map(removeSensitiveFields);
        }
        else if (obj && typeof obj === 'object') {
            const cleaned = { ...obj };
            sensitiveFields.forEach(field => {
                if (cleaned[field]) {
                    cleaned[field] = '[REDACTED]';
                }
            });
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
//# sourceMappingURL=loggingMiddleware.js.map