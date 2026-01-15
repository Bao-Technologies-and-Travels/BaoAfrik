import { Router } from 'express';
import socialAccountController from '@/controllers/socialAccountController';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get all social accounts
router.get('/', socialAccountController.getSocialAccounts);

// Get social account status
router.get('/status', socialAccountController.getSocialAccountStatus);

// Connect social account
router.post('/connect', socialAccountController.connectSocialAccount);

// Disconnect social account
router.delete('/:provider', socialAccountController.disconnectSocialAccount);

export default router;
