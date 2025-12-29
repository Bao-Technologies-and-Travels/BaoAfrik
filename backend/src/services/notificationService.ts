import prisma from '@/config/database';

export interface CreateNotificationData {
    userId: string;
    actorId?: string | null;
    type: string;
    message?: string;
    metadata?: any;
}

export class NotificationService {
    async createNotification(data: CreateNotificationData) {
        const notif = await prisma.notification.create({
            data: {
                userId: data.userId,
                actorId: data.actorId ?? null,
                type: data.type,
                message: data.message ?? null,
                metadata: data.metadata ?? null,
                isRead: false
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        email: true
                    }
                }
            }
        });

        // if(data.actorId) {
        //     const actor = await prisma.user.findUnique({
        //         where: { id: data.actorId },
        //         select: {
        //             id: true,
        //             firstName: true,
        //             lastName: true,
        //             profileImage: true,
        //             email: true
        //         },
        //     });
        //     return { ...notif, actor };
        // }
        return notif;
    }

    async getNotifications(userId: string, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            await prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    actor: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true
                        }
                    }
                }
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

    async createNotificationsForAllUsers(data: {
        actorId: string;
        type: string;
        message: string;
        metadata?: any;
    }) {
        try {
            // Get all active users except the actor (seller)
            const users = await prisma.user.findMany({
                where: {
                    id: { not: data.actorId },
                    isActive: true
                },
                select: {
                    id: true
                }
            });

            if (users.length === 0) {
                return { count: 0, userIds: [] };
            }

            // Create notifications in batch using createMany
            const result = await prisma.notification.createMany({
                data: users.map(user => ({
                    userId: user.id,
                    actorId: data.actorId,
                    type: data.type,
                    message: data.message,
                    metadata: data.metadata ?? null,
                    isRead: false
                }))
            });

            return {
                count: result.count,
                userIds: users.map(u => u.id)
            };
        } catch (error: any) {
            throw new Error(`Error creating notifications for all users: ${error.message}`);
        }
    }
}

export const notificationService = new NotificationService();