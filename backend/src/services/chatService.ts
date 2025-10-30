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

            // create new conversation
            const conversation = await tx.conversation.create({
                data: {
                    productId: data.productId || null,
                    participants: {
                        create: [
                            { userId: data.creatorId },
                            { userId: participant.id }
                        ]
                    }
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
                            name: true,
                            price: true,
                            images: true
                        }
                    }
                }
            });

            let lastMessage = null;

            // add disclaimer as first message
            const safetyMessage = await tx.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: data.creatorId,
                    content: this.getSafetyDisclaimer(),
                    messageType: MessageType.TEXT,
                    productData: null
                }
            });

            lastMessage = safetyMessage;

            if (data.initialMessage && data.initialMessage.trim() !== this.getSafetyDisclaimer().trim()) {
                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: data.initialMessage,
                        messageType: MessageType.TEXT,
                        productData: data.productData ? JSON.stringify(data.productData) : null
                    }
                });

                lastMessage = initialMessage;
            }

            // updare conversation with last message
            await tx.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessageId: lastMessage.id,
                    lastMessageAt: new Date()
                }
            });

            return {
            ...conversation,
            lastMessage: {
                id: lastMessage.id,
                content: lastMessage.content,
                messageType: lastMessage.messageType,
                createdAt: lastMessage.createdAt,
            }
        };
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
                        name: true,
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

        // Debug logging
        console.log('🔍 getUserConversations - Raw data:', {
            userId,
            totalConversationsFound: conversations.length,
            conversationDetails: conversations.map(conv => ({
                id: conv.id,
                allParticipantIds: conv.participants.map(p => p.userId),
                allParticipantEmails: conv.participants.map(p => p.user?.email || 'no-email'),
                unreadCount: conv.messages.length,
                currentUserIsParticipant: conv.participants.some(p => p.userId === userId)
            }))
        });

        const processedConversations = conversations.map(conv => {
            // find the other participant
            const otherParticipants = conv.participants.filter(p => p.userId !== userId);

            console.log('🔍 Processing conversation:', conv.id, {
                totalParticipants: conv.participants.length,
                otherParticipantsCount: otherParticipants.length,
                otherParticipantEmails: otherParticipants.map(p => p.user?.email || 'no-email'),
                allParticipants: conv.participants.map(p => ({
                    userId: p.userId,
                    email: p.user?.email,
                    firstName: p.user?.firstName,
                    lastName: p.user?.lastName
                }))
            });

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
                lastMessage: conv.lastMessage,
                unreadCount: conv.messages.length,
                lastReadAt: currentUserParticipant?.lastReadAt,
                updatedAt: conv.updatedAt,
                createdAt: conv.createdAt,
                isEmailBased: !conv.productId
            };

            console.log('✅ Final conversation object:', {
                id: result.id,
                participant: result.participant?.email || 'no-email',
                unreadCount: result.unreadCount
            });

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

        // Update last read time for the user
        await prisma.conversationParticipant.updateMany({
            where: {
                conversationId,
                userId
            },
            data: {
                lastReadAt: new Date()
            }
        })

        // Parse productData from JSON string and add safety disclaimer flag
        const processedMessages = messages.map((message, index) => ({
            ...message,
            productData: message.productData ? JSON.parse(message.productData) : null,
            showSafetyDisclaimer: index === 0 && message.content === this.getSafetyDisclaimer()
        }));

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

            // Create new conversation
            const conversation = await tx.conversation.create({
                data: {
                    productId: data.productId || null,
                    participants: {
                        create: [
                            { userId: data.creatorId },
                            { userId: data.participantId }
                        ]
                    }
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
                            name: true,
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

            // Add safety disclaimer as first message
            const safetyMessage = await tx.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: data.creatorId,
                    content: this.getSafetyDisclaimer(),
                    messageType: MessageType.TEXT,
                    productId: data.productId || null
                }
            });

            lastMessage = safetyMessage;

            // Add initial message if provided
            if (data.initialMessage && data.initialMessage.trim()) {
                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: data.initialMessage,
                        messageType: MessageType.TEXT,
                        productId: data.productId || null
                    }
                });

                lastMessage = initialMessage;
            }

            // Update conversation with last message
            await tx.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessageId: lastMessage.id,
                    lastMessageAt: new Date()
                }
            });

            return {
                ...conversation,
                lastMessage: {
                    id: lastMessage.id,
                    content: lastMessage.content,
                    messageType: lastMessage.messageType,
                    createdAt: lastMessage.createdAt,
                }
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

            const isDisclaimerMessage = data.content === this.getSafetyDisclaimer();

            // Check if this conversation already has a message with product data
            const existingProductMessages = await tx.message.count({
                where: {
                    conversationId: data.conversationId,
                    NOT: {
                        productData: null
                    }
                }
            });

            const hasExistingProductData = existingProductMessages > 0;
            // Create message - only include productData if:
            // 1. It's provided in the request
            // 2. This conversation doesn't already have product data  
            // 3. It's NOT a disclaimer message
            const shouldIncludeProductData = data.productData && !hasExistingProductData && !isDisclaimerMessage;

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

            // Update conversation with last message
            await tx.conversation.update({
                where: { id: data.conversationId },
                data: {
                    lastMessageId: message.id,
                    lastMessageAt: new Date(),
                    updatedAt: new Date()
                }
            });

            // create message status for sender
            await tx.messageStatus.create({
                data: {
                    messageId: message.id,
                    userId: data.senderId,
                    status: 'sent'
                }
            });

            // Parse productData back to object for response
            const messageWithProductData = {
                ...message,
                productData: shouldIncludeProductData ? data.productData : null
            };

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
            url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
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

        // Update messages as read
        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: userId },
                isRead: false
            },
            data: {
                isRead: true
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
                    updatedAt: new Date()
                },
                create: {
                    messageId: message.id,
                    userId: userId,
                    status: 'read'
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
                lastReadAt: new Date()
            }
        });

        return unreadMessages;
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
                        id: true
                    }
                }
            }
        });

        return conversations.map(conv => ({
            conversationId: conv.id,
            unreadCount: conv.messages.length
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

        return conversation.participants.map(p => p.user);
    }

    async updateMessageStatus(messageId: string, userId: string, status: 'sent' | 'delivered' | 'read') {
        return await prisma.messageStatus.upsert({
            where: {
                messageId_userId: {
                    messageId,
                    userId
                }
            },
            update: {
                status,
                updatedAt: new Date()
            },
            create: {
                messageId,
                userId,
                status
            }
        });
    }

    private getSafetyDisclaimer(): string {
        return `🔒 Secure Messaging: For your safety, keep conversations on BAO'Afrik. Don't share personal info, send money, or share account details. Report suspicious activity. Stay safe!`;
    }
}