import { Router } from 'express';
import oauthController from '@/controllers/oauthController';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// OAuth initiation endpoints (require authentication)
router.get('/facebook/connect', authenticateToken, oauthController.initiateFacebookOAuth);
router.get('/instagram/connect', authenticateToken, oauthController.initiateInstagramOAuth);
router.get('/linkedin/connect', authenticateToken, oauthController.initiateLinkedInOAuth);
router.get('/x/connect', authenticateToken, oauthController.initiateXOAuth);

// OAuth callback endpoint (public - called by OAuth provider)
router.get('/callback', oauthController.handleOAuthCallback);

export default router;
