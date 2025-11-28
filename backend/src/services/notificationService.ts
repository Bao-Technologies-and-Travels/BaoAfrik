import prisma from '@/config/database';

export interface CreateNotificationData {
    userId: string;
    actorId?: string | null;
    type: string;
    title: string;
    body?: string;
    meta?: any;
}

export class NotificationService {
    async createNotification(data: CreateNotificationData) {
        const notif = await prisma.notification.create({
            data: {
                userId: data.userId,
                actorId: data.actorId ?? null,
                type: data.type,
                title: data.title,
                body: data.body ?? null,
                meta: data.meta ?? null,
            },
        });
        return notif;
    }

    async getNotifications(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            await prisma.notification.count({ where: { userId } }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async markAsRead(notificationId: string, userId: string) {
        const notif = await prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
        return notif;
    }

    async markAllAsRead(userId: string) {
        const result = await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
        return result;
    }

    async getUnreadCount(userId: string) {
        const count = await prisma.notification.count({
            where: { userId, isRead: false },
        });
        return count;
    }
}

export const notificationService = new NotificationService();