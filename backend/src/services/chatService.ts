import { PrismaClient, MessageType } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export interface CreateConversationData {
    creatorId: string;
    participantId: string;
    productId?: string;
    initialMessage?: string;
}

export interface MessageData {
    conversationId: string;
    senderId: string;
    content: string;
    messageType: MessageType | string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    replyToId?: string;
    imageUrl?: string;
    audioUrl?: string;
    productData?: any;
}

export interface CreateConversationData {
    creatorId: string
    participantId: string
    productId?: string
    initialMessage?: string
    productData?: any
}

export interface CreateConversationByEmailData {
    creatorId: string
    participantEmail: string
    productId?: string
    initialMessage?: string
    productData?: any
}

export class ChatService {
    private s3Client: S3Client;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    private formatTo12HourTime(date: Date): string {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    async createConversationByEmail(data: CreateConversationByEmailData) {
        return await prisma.$transaction(async (tx) => {
            // find participant by email
            const participant = await tx.user.findUnique({
                where: {
                    email: data.participantEmail,
                    isActive: true,
                    emailVerified: true
                }
            });

            if (!participant) {
                throw new Error('User not found with this email');
            }

            if (participant.id === data.creatorId) {
                throw new Error('Cannot create conversation with yourself');
            }

            // check for existing conversation
            const existingConv = await tx.conversation.findFirst({
                where: {
                    productId: data.productId || null,
                    participants: {
                        every: {
                            userId: {
                                in: [data.creatorId, participant.id]
                            }
                        }
                    }
                },
                include: {
                    participants: true
                }
            });

            if (existingConv) {
                return existingConv;
            }

            const now = new Date();

            // create new conversation
            const conversation = await tx.conversation.create({
                data: {
                    productId: data.productId || null,
                    participants: {
                        create: [
                            { userId: data.creatorId },
                            { userId: participant.id }
                        ]
                    },
                    createdAt: now,
                    updatedAt: now
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true,
                                    email: true
                                }
                            }
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            images: true
                        }
                    }
                }
            });

            let lastMessage = null;

            // Add initial message if provided
            if (data.initialMessage && data.initialMessage.trim()) {
                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: data.initialMessage,
                        messageType: MessageType.TEXT,
                        productData: data.productData ? JSON.stringify(data.productData) : null,
                        createdAt: now
                    }
                });

                lastMessage = initialMessage;
            }

            // Update conversation with last message
            if (lastMessage) {
                await tx.conversation.update({
                    where: { id: conversation.id },
                    data: {
                        lastMessageId: lastMessage.id,
                        lastMessageAt: now,
                        updatedAt: now
                    }
                });
            }

            const response = {
                ...conversation,
                lastMessage: lastMessage ? {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    messageType: lastMessage.messageType,
                    createdAt: lastMessage.createdAt,
                    formattedTime: this.formatTo12HourTime(lastMessage.createdAt)
                } : null,
                productData: data.productData || null,
                formattedCreatedAt: this.formatTo12HourTime(conversation.createdAt),
                formattedUpdatedAt: this.formatTo12HourTime(conversation.updatedAt)
            };

            return response;
        });
    }

    async getUserConversations(userId: string) {
        console.log('getUserConversation called for user:', userId);

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true,
                                isVerifiedSeller: true
                            }
                        }
                    }
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true,
                        seller: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        }
                    }
                },
                lastMessage: {
                    select: {
                        id: true,
                        content: true,
                        messageType: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                messages: {
                    where: {
                        isRead: false,
                        senderId: { not: userId }
                    },
                    select: {
                        id: true
                    }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            }
        });

        const processedConversations = conversations.map(conv => {
            const otherParticipants = conv.participants.filter(p => p.userId !== userId);

            if (otherParticipants.length === 0) {
                console.warn('Conversation has no other participant. Conversation:', conv.id, 'All Participants:', conv.participants.map(p => p.user?.email));
                return null;
            }

            const otherParticipant = otherParticipants[0]?.user;

            if (!otherParticipant) {
                console.error('Other participant user data is undefined! Conversation:', conv.id);
                return null;
            }

            const currentUserParticipant = conv.participants.find(p => p.userId === userId);

            const result = {
                id: conv.id,
                participant: otherParticipant,
                product: conv.product,
                lastMessage: conv.lastMessage ? {
                    ...conv.lastMessage,
                    formattedTime: this.formatTo12HourTime(conv.lastMessage.createdAt)
                } : null,
                unreadCount: conv.messages.length,
                lastReadAt: currentUserParticipant?.lastReadAt ? this.formatTo12HourTime(currentUserParticipant.lastReadAt) : null,
                updatedAt: conv.updatedAt,
                formattedUpdatedAt: this.formatTo12HourTime(conv.updatedAt),
                createdAt: conv.createdAt,
                formattedCreatedAt: this.formatTo12HourTime(conv.createdAt),
                isEmailBased: !conv.productId
            };

            return result;
        }).filter((conv): conv is NonNullable<typeof conv> => conv !== null);

        console.log('🎯 Final filtered conversations count:', processedConversations.length);

        return processedConversations;
    }

    async getConversationMessages(conversationId: string, userId: string) {
        // Verify user has access to this conversation
        const conversation = await prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: {
                    some: {
                        userId: userId
                    }
                }
            }
        });

        if (!conversation) {
            throw new Error('Conversation not found or access denied');
        }

        const messages = await prisma.message.findMany({
            where: { conversationId },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        isVerifiedSeller: true
                    }
                },
                replyTo: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                },
                statuses: {
                    where: {
                        userId: userId
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        const now = new Date();

        // Update last read time for the user
        await prisma.conversationParticipant.updateMany({
            where: {
                conversationId,
                userId
            },
            data: {
                lastReadAt: now
            }
        })

        // Parse productData from JSON string 
        const processedMessages = messages.map((message) => {
            let parsedProductData = null;

            try {
                if (message.productData) {
                    parsedProductData = JSON.parse(message.productData);
                }
            } catch (error) {
                console.error('Error parsing productData for message:', message.id, error);
                parsedProductData = null;
            }

            return {
                ...message,
                productData: parsedProductData,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                imageUrl: message.imageUrl,
                audioUrl: message.audioUrl,
                formattedTime: this.formatTo12HourTime(message.createdAt)
            };
        });

        return processedMessages;
    }

    async createConversation(data: CreateConversationData) {
        return await prisma.$transaction(async (tx) => {
            // Check if conversation already exists
            const existingConv = await tx.conversation.findFirst({
                where: {
                    productId: data.productId || null,
                    participants: {
                        every: {
                            userId: {
                                in: [data.creatorId, data.participantId]
                            }
                        }
                    }
                },
                include: {
                    participants: true
                }
            });

            if (existingConv) {
                return existingConv;
            }

            const now = new Date();

            // Create new conversation
            const conversation = await tx.conversation.create({
                data: {
                    productId: data.productId || null,
                    participants: {
                        create: [
                            { userId: data.creatorId },
                            { userId: data.participantId }
                        ]
                    },
                    createdAt: now,
                    updatedAt: now
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true
                                }
                            }
                        }
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            images: true,
                            seller: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            });

            let lastMessage = null;

            // Add initial message if provided
            if (data.initialMessage && data.initialMessage.trim()) {
                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: data.initialMessage,
                        messageType: MessageType.TEXT,
                        productData: data.productData ? JSON.stringify(data.productData) : null,
                        createdAt: now
                    }
                });

                lastMessage = initialMessage;
            }

            // Update conversation with last message
            if (lastMessage) {
                await tx.conversation.update({
                    where: { id: conversation.id },
                    data: {
                        lastMessageId: lastMessage.id,
                        lastMessageAt: now,
                        updatedAt: now
                    }
                });
            }

            return {
                ...conversation,
                lastMessage: lastMessage ? {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    messageType: lastMessage.messageType,
                    createdAt: lastMessage.createdAt,
                    formattedTime: this.formatTo12HourTime(lastMessage.createdAt)
                } : null,
                productData: data.productData || null,
                formattedCreatedAt: this.formatTo12HourTime(conversation.createdAt),
                formattedUpdatedAt: this.formatTo12HourTime(conversation.updatedAt)
            };
        });
    }

    async sendMessage(data: MessageData) {
        return await prisma.$transaction(async (tx) => {
            // Verify conversation exists and user is participant
            const conversation = await tx.conversation.findFirst({
                where: {
                    id: data.conversationId,
                    participants: {
                        some: {
                            userId: data.senderId
                        }
                    }
                },
                include: {
                    participants: {
                        where: {
                            userId: { not: data.senderId }
                        }
                    }
                }
            });

            if (!conversation) {
                throw new Error('Conversation not found or access denied');
            }

            // get the receiver
            const receiver = conversation?.participants[0];
            if (!receiver) {
                throw new Error('No receiver found for this conversation');
            }

            // Validate and normalize messageType
            let normalizedMessageType: MessageType;
            if (typeof data.messageType === 'string') {
                // Convert string to MessageType enum
                const upperCaseType = data.messageType.toUpperCase();
                if (upperCaseType in MessageType) {
                    normalizedMessageType = MessageType[upperCaseType as keyof typeof MessageType];
                } else {
                    // Default to TEXT if invalid
                    normalizedMessageType = MessageType.TEXT;
                }
            } else {
                normalizedMessageType = data.messageType;
            }

            // Create message
            const shouldIncludeProductData = data.productData;

            const now = new Date();

            console.log('📨 Backend received message data:', {
                content: data.content,
                messageType: data.messageType,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileSize: data.fileSize
            });

            // Create message
            const message = await tx.message.create({
                data: {
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: data.content,
                    messageType: normalizedMessageType,
                    fileUrl: data.fileUrl,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    imageUrl: data.imageUrl,
                    audioUrl: data.audioUrl,
                    replyToId: data.replyToId,
                    productData: shouldIncludeProductData ? JSON.stringify(data.productData) : null,
                    createdAt: now
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            isVerifiedSeller: true
                        }
                    },
                }
            });

            console.log('💾 Database message after creation:', {
                id: message.id,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize
            });

            // Update conversation with last message
            await tx.conversation.update({
                where: { id: data.conversationId },
                data: {
                    lastMessageId: message.id,
                    lastMessageAt: now,
                    updatedAt: now
                }
            });

            // create message status for sender
            await tx.messageStatus.create({
                data: {
                    messageId: message.id,
                    userId: data.senderId,
                    status: 'sent',
                    createdAt: now,
                    updatedAt: now
                }
            });

            // Parse productData back to object for response
            const messageWithProductData = {
                ...message,
                productData: shouldIncludeProductData ? data.productData : null,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                imageUrl: message.imageUrl,
                audioUrl: message.audioUrl,
                formattedTime: this.formatTo12HourTime(message.createdAt)
            };

            console.log('📤 Response message with file data:', {
                id: messageWithProductData.id,
                fileUrl: messageWithProductData.fileUrl,
                fileName: messageWithProductData.fileName,
                fileSize: messageWithProductData.fileSize
            });

            return messageWithProductData;
        });
    }

    async generatePresignedUrl(fileName: string, fileType: string, userId: string) {
        const allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg',
            'video/mp4', 'video/quicktime',
            'audio/mpeg', 'audio/wav', 'audio/webm',
            'application/pdf'
        ];

        const maxSize = 50 * 1024 * 1024; // 50MB

        if (!allowedMimeTypes.includes(fileType)) {
            throw new Error('File type not allowed');
        }

        const fileExtension = fileName.split('.').pop();
        const key = `chat-attachments/${userId}/${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET!,
            Key: key,
            ContentType: fileType,
            ServerSideEncryption: 'AES256',
        });

        const presignedUrl = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600
        });

        return {
            presignedUrl,
            key,
            url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            generatedAt: this.formatTo12HourTime(new Date())
        };
    }

    async markMessagesAsRead(conversationId: string, userId: string) {
        // get unread messages in conversation
        const unreadMessages = await prisma.message.findMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false
            },
            select: {
                id: true
            }
        });

        const now = new Date();

        // Update messages as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false
            },
            data: {
                isRead: true,
                updatedAt: now
            }
        });

        // update message status for each message
        for (const message of unreadMessages) {
            await prisma.messageStatus.upsert({
                where: {
                    messageId_userId: {
                        messageId: message.id,
                        userId: userId
                    }
                },
                update: {
                    status: 'read',
                    updatedAt: now
                },
                create: {
                    messageId: message.id,
                    userId: userId,
                    status: 'read',
                    createdAt: now,
                    updatedAt: now
                }
            });
        }

        // update participant's last read time
        await prisma.conversationParticipant.updateMany({
            where: {
                conversationId,
                userId
            },
            data: {
                lastReadAt: now
            }
        });

        return {
            unreadMessages,
            markReadAt: this.formatTo12HourTime(now)
        };
    }

    async getUnreadCounts(userId: string) {
        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        userId: userId
                    }
                }
            },
            include: {
                messages: {
                    where: {
                        senderId: { not: userId },
                        isRead: false
                    },
                    select: {
                        id: true,
                        createdAt: true
                    }
                }
            }
        });

        return conversations.map(conv => ({
            conversationId: conv.id,
            unreadCount: conv.messages.length,
            checkedAt: this.formatTo12HourTime(new Date())
        }));
    }

    async getConversationParticipants(conversationId: string) {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true,
                            }
                        }
                    }
                }
            }
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        return {
            participants: conversation.participants.map(p => p.user),
            fetchedAt: this.formatTo12HourTime(new Date())
        };
    }

    async updateMessageStatus(messageId: string, userId: string, status: 'sent' | 'delivered' | 'read') {
        const now = new Date();

        const messageStatus = await prisma.messageStatus.upsert({
            where: {
                messageId_userId: {
                    messageId,
                    userId
                }
            },
            update: {
                status,
                updatedAt: now
            },
            create: {
                messageId,
                userId,
                status,
                createdAt: now,
                updatedAt: now
            }
        });

        return {
            ...messageStatus,
            formattedCreatedAt: this.formatTo12HourTime(messageStatus.createdAt),
            formattedUpdatedAt: this.formatTo12HourTime(messageStatus.updatedAt)
        };
    }
}