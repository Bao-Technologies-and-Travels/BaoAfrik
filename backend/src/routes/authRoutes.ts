import { Router } from 'express';
// import rateLimit from 'express-rate-limit';
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
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Limit each IP to 5 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many authentication attempts, please try again later.',
//     errors: { general: 'Rate limit exceeded' }
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const generalLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests, please try again later.',
//     errors: { general: 'Rate limit exceeded' }
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// Public routes (no authentication required)
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/verify-email', validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', authController.resendVerificationCode);
router.post('/forgot-password', validateForgotPassword, authController.forgotPassword);
router.post('/verify-reset-code', validateVerifyResetCode, authController.verifyResetCode);
router.post('/reset-password', validateResetPassword, authController.resetPassword);

// Token refresh
router.post('/refresh', authController.refreshToken);

// Protected routes (authentication required)
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.put('/profile', authenticateToken, validateUpdateProfile, authController.updateProfile);
router.put('/change-password', authenticateToken, validateChangePassword, authController.changePassword);

export default router;
