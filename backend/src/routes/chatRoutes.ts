import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const chatController = new ChatController();

router.use(authenticateToken);

router.get('/conversations', chatController.getConversations);
router.get('/conversations/:conversationId', chatController.getConversationDetails);
router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
router.post('/conversations/email', chatController.createConversationByEmail);
router.post('/conversations', chatController.createConversation);
router.post('/upload-url', chatController.generatePresignedUrl);
router.post('/conversations/:conversationId/read', chatController.markAsRead);
router.get('/unread-counts', chatController.getUnreadCounts);
router.post('/contact-seller', chatController.contactSeller);

export default router;