import { Router } from 'express';
import sessionController from '@/controllers/sessionController';
import { authenticateToken } from '@/middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user sessions (POST to accept refresh token in body, GET for backward compatibility)
router.post('/', sessionController.getUserSessions);
router.get('/', sessionController.getUserSessions);

// Update session activity
router.patch('/activity', sessionController.updateSessionActivity);

// Revoke specific session
router.delete('/:sessionId', sessionController.revokeSession);

// Revoke all other sessions
router.delete('/', sessionController.revokeAllOtherSessions);

export default router;
