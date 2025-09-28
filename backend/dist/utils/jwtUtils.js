"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.generateSecureToken = exports.generateTokenPair = void 0;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyAccessToken = verifyAccessToken;
exports.verifyRefreshToken = verifyRefreshToken;
exports.parseDurationToSeconds = parseDurationToSeconds;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const errorUtils_1 = require("@/utils/errorUtils");
function requiredEnv(name, fallback) {
    const v = process.env[name] ?? fallback;
    if (!v)
        throw new Error(`Missing required env var ${name}`);
    return v;
}
const JWT_SECRET = requiredEnv('JWT_SECRET');
const JWT_REFRESH_SECRET = requiredEnv('JWT_REFRESH_SECRET');
const ACCESS_TTL = process.env.JWT_EXPIRE_TIME ?? '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_EXPIRE_TIME ?? '7d';
function signAccessToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: ACCESS_TTL,
        algorithm: 'HS256'
    });
}
function signRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TTL,
        algorithm: 'HS256'
    });
}
const generateTokenPair = (userId, email) => {
    const payload = { userId, email };
    return {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
    };
};
exports.generateTokenPair = generateTokenPair;
function verifyAccessToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded === 'string')
            throw new Error('Invalid access token payload');
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw (0, errorUtils_1.createError)('Access token expired', 401, 'TOKEN_EXPIRED');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw (0, errorUtils_1.createError)('Invalid access token', 401, 'INVALID_TOKEN');
        }
        throw (0, errorUtils_1.createError)('Token verification failed', 401, 'TOKEN_VERIFICATION_FAILED');
    }
}
function verifyRefreshToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_REFRESH_SECRET);
        if (typeof decoded === 'string')
            throw new Error('Invalid refresh token payload');
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw (0, errorUtils_1.createError)('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw (0, errorUtils_1.createError)('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
        }
        throw (0, errorUtils_1.createError)('Refresh token verification failed', 401, 'REFRESH_TOKEN_VERIFICATION_FAILED');
    }
}
const generateSecureToken = () => {
    return crypto_1.default.randomBytes(32).toString('hex');
};
exports.generateSecureToken = generateSecureToken;
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
function parseDurationToSeconds(input) {
    const match = /^(\d+)([smhd])$/.exec(input);
    if (!match || !match[1] || !match[2]) {
        throw new Error(`Invalid duration: ${input}`);
    }
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    const mult = { s: 1, m: 60, h: 3600, d: 86400 }[unit];
    return amount * mult;
}
//# sourceMappingURL=jwtUtils.js.map