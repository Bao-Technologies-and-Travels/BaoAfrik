import { Router } from 'express';
import twoFactorController from '@/controllers/twoFactorController';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get 2FA status
router.get('/status', twoFactorController.getTwoFactorStatus);

// Enable 2FA
router.post('/enable', twoFactorController.enableTwoFactor);

// Verify 2FA code
router.post('/verify', twoFactorController.verifyTwoFactorCode);

// Disable 2FA
router.post('/disable', twoFactorController.disableTwoFactor);

// Resend verification code
router.post('/resend-code', twoFactorController.resendTwoFactorCode);

// Verify credentials (email/password) before enabling 2FA
router.post('/verify-credentials', twoFactorController.verifyCredentials);

export default router;
