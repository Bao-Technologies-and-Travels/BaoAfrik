import { Router } from "express";
import { NotificationController } from "@/controllers/notificationController";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = Router();
const notificationController = new NotificationController();

router.get('/', authenticateToken, notificationController.list.bind(notificationController));
router.get('/unread-count', authenticateToken, notificationController.unreadCount.bind(notificationController));
router.put('/mark-all-read', authenticateToken, notificationController.markAllRead.bind(notificationController));
router.put('/:id/read', authenticateToken, notificationController.markRead.bind(notificationController));

export default router;