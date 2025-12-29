import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const chatController = new ChatController();

router.use(authenticateToken);

router.get('/conversations', chatController.getConversations);
router.get('/conversations/:conversationId', chatController.getConversationDetails);
router.get('/conversations/:conversationId/messages', chatController.getConversationMessages);
router.post('/conversations', chatController.createConversation);
router.post('/upload-url', chatController.generatePresignedUrl);
router.post('/conversations/:conversationId/read', chatController.markAsRead);
router.get('/unread-counts', chatController.getUnreadCounts);
router.post('/contact-seller', chatController.contactSeller);
router.post('/contact-request', chatController.contactRequest);

// In chatRoutes.ts
router.post('/conversations/:conversationId/messages', chatController.sendMessage);
router.get('/conversations/:conversationId/messages', chatController.getMessages);
router.post('/conversations/:conversationId/read', chatController.markAsRead);

// Message reactions
router.post('/messages/:messageId/reactions', chatController.addReaction);
router.delete('/messages/:messageId/reactions', chatController.removeReaction);

// Message metadata (pin, archive, important, label)
router.patch('/messages/:messageId/metadata', chatController.updateMessageMetadata);
router.get('/messages/:messageId/metadata', chatController.getMessageMetadata);

// Conversation metadata (pin, archive, mute, label)
router.patch('/conversations/:conversationId/metadata', chatController.updateConversationMetadata);
router.get('/conversations/:conversationId/metadata', chatController.getConversationMetadata);
router.delete('/conversations/:conversationId', chatController.deleteConversation);
router.get('/conversations/archived/count', chatController.getArchivedCount);

export default router;