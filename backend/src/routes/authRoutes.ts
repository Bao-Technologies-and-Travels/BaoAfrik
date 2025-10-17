import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import authController, { verifyResetCode } from '@/controllers/authController';
import { authenticateToken } from '@/middleware/authMiddleware';
import { 
  validateRegister,
  validateLogin,
  validateEmailVerification,
  validateResendVerification,
  validateUpdateProfile,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateVerifyResetCode,
} from '@/middleware/validationMiddleware';

const router = Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.',
    errors: { general: 'Rate limit exceeded' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
    errors: { general: 'Rate limit exceeded' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes (no authentication required)
router.post('/register', authLimiter, validateRegister, authController.register);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/verify-email', generalLimiter, validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', generalLimiter, authController.resendVerificationCode);
router.post('/forgot-password', generalLimiter, validateForgotPassword, authController.forgotPassword);
router.post('/verify-reset-code', generalLimiter, validateVerifyResetCode, authController.verifyResetCode);
router.post('/reset-password', generalLimiter, validateResetPassword, authController.resetPassword);

router.get('/api/test-401', (req, res, next) => {
  const { createUnauthorizedError } = require('@/utils/errorUtils');
  next(createUnauthorizedError('This should return 401'));
});

// Token refresh
router.post('/refresh', generalLimiter, authController.refreshToken);

// Protected routes (authentication required)
router.post('/logout', generalLimiter, authController.logout);
router.get('/me', generalLimiter, authenticateToken, authController.getCurrentUser);
router.put('/profile', generalLimiter, authenticateToken, validateUpdateProfile, authController.updateProfile);
router.put('/change-password', authLimiter, authenticateToken, validateChangePassword, authController.changePassword);

export default router;
