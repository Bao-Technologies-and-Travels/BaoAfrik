import { Request, Response } from "express";
import { notificationService } from "@/services/notificationService";

export class NotificationController {
    async list(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const page = parseInt((req.query.page as string) || '1', 10);
            const limit = parseInt((req.query.limit as string) || '20', 10);
            const data = await notificationService.getNotifications(userId, page, limit);
            return res.json({ success: true, data });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Failed to load notifications' });
        }
    }

    async markRead(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ success: false, error: 'Notification id is required' });
            }
            await notificationService.markAsRead(id, userId);
            return res.json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Failed to mark read' });
        }
    }

    async markAllRead(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            await notificationService.markAllAsRead(userId);
            return res.json({ success: true });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Failed to mark all as read' });
        }
    }

    async unreadCount(req: Request, res: Response) {
        try {
            const userId = req.user!.id;
            const count = await notificationService.getUnreadCount(userId);
            return res.json({ success: true, data: { unreadCount: count } });
        } catch (error: any) {
            return res.status(500).json({ success: false, error: 'Failed to get unread count' });
        }
    }
}

export const notificationController = new NotificationController();