"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireResourceOwnership = exports.requireVerifiedSeller = exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const asyncHandler_1 = require("../utils/asyncHandler");
const errorUtils_1 = require("../utils/errorUtils");
const logger_1 = __importDefault(require("../config/logger"));
const prisma = new client_1.PrismaClient();
exports.authenticateToken = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        throw (0, errorUtils_1.createUnauthorizedError)('Access token is required');
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                isVerifiedSeller: true,
                emailVerified: true,
            },
        });
        if (!user) {
            throw (0, errorUtils_1.createUnauthorizedError)('User not found or inactive');
        }
        if (!user.emailVerified) {
            throw (0, errorUtils_1.createUnauthorizedError)('Email verification required');
        }
        req.user = user;
        logger_1.default.info('User authenticated successfully', {
            userId: user.id,
            email: user.email,
            requestId: req.requestId,
        });
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw (0, errorUtils_1.createUnauthorizedError)('Invalid access token');
        }
        else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw (0, errorUtils_1.createUnauthorizedError)('Access token expired');
        }
        else {
            throw error;
        }
    }
});
exports.optionalAuth = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return next();
    }
    try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.userId,
                isActive: true,
                emailVerified: true,
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                isVerifiedSeller: true,
            },
        });
        if (user) {
            req.user = user;
            logger_1.default.info('Optional auth: User authenticated', {
                userId: user.id,
                requestId: req.requestId,
            });
        }
    }
    catch (error) {
        logger_1.default.debug('Optional auth failed', {
            error: error instanceof Error ? error.message : 'Unknown error',
            requestId: req.requestId,
        });
    }
    next();
});
const requireVerifiedSeller = (req, res, next) => {
    if (!req.user) {
        throw (0, errorUtils_1.createUnauthorizedError)('Authentication required');
    }
    if (!req.user.isVerifiedSeller) {
        throw (0, errorUtils_1.createForbiddenError)('Verified seller status required');
    }
    next();
};
exports.requireVerifiedSeller = requireVerifiedSeller;
const requireResourceOwnership = (resourceUserIdField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            throw (0, errorUtils_1.createUnauthorizedError)('Authentication required');
        }
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        if (req.user.id !== resourceUserId) {
            throw (0, errorUtils_1.createForbiddenError)('Access denied: You can only access your own resources');
        }
        next();
    };
};
exports.requireResourceOwnership = requireResourceOwnership;
//# sourceMappingURL=authMiddleware.js.map