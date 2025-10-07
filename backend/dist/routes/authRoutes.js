"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController_1 = __importDefault(require("../controllers/authController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = (0, express_1.Router)();
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        errors: { general: 'Rate limit exceeded' }
    },
    standardHeaders: true,
    legacyHeaders: false,
});
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
        errors: { general: 'Rate limit exceeded' }
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.post('/register', authLimiter, validationMiddleware_1.validateRegister, authController_1.default.register);
router.post('/login', authLimiter, validationMiddleware_1.validateLogin, authController_1.default.login);
router.post('/verify-email', generalLimiter, validationMiddleware_1.validateEmailVerification, authController_1.default.verifyEmail);
router.post('/resend-verification', generalLimiter, validationMiddleware_1.validateResendVerification, authController_1.default.resendVerificationCode);
router.post('/forgot-password', generalLimiter, validationMiddleware_1.validateForgotPassword, authController_1.default.forgotPassword);
router.post('/reset-password', generalLimiter, validationMiddleware_1.validateResetPassword, authController_1.default.resetPassword);
router.post('/refresh', generalLimiter, authController_1.default.refreshToken);
router.post('/logout', generalLimiter, authController_1.default.logout);
router.get('/me', generalLimiter, authMiddleware_1.authenticateToken, authController_1.default.getCurrentUser);
router.put('/profile', generalLimiter, authMiddleware_1.authenticateToken, validationMiddleware_1.validateUpdateProfile, authController_1.default.updateProfile);
router.put('/change-password', authLimiter, authMiddleware_1.authenticateToken, validationMiddleware_1.validateChangePassword, authController_1.default.changePassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map