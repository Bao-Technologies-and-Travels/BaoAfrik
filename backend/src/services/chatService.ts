import prisma from '@/config/database'; import { MessageType } from '../generated/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// const prisma = new PrismaClient({} as any);

export interface CreateConversationData {
    creatorId: string;
    participantId: string;
    productId?: string;
    initialMessage?: string;
    productData?: any;
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
    initialMessage?: string
    productData?: any
}

export class ChatService {
    private s3Client: S3Client;
    private algorithm = 'aes-256-gcm';
    private encryptionKey: Buffer;
    private dbEncryptionEnabled: boolean = false

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });

        this.encryptionKey = crypto.scryptSync(
            process.env.APP_ENCRYPTION_KEY!,
            'app-salt',
            32
        );

    }

    // app level encryption
    private encryptMessage(content: string): { encrypted: string, iv: string, authTag: string } {
        const iv = crypto.randomBytes(16);
        const cipher: crypto.CipherGCM = crypto.createCipheriv(this.algorithm, this.encryptionKey, iv) as crypto.CipherGCM;

        let encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        return { encrypted, iv: iv.toString('hex'), authTag };
    }

    // app level decryption
    private decryptMessage(encryptedData: string, iv: string, authTag: string): string {
        try {
            const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
                this.algorithm,
                this.encryptionKey,
                Buffer.from(iv, 'hex')
            ) as crypto.DecipherGCM;

            decipher.setAuthTag(Buffer.from(authTag, 'hex'));

            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            throw new Error('Failed to decrypt message');
        }
    }

    private formatTo12HourTime(date: Date): string {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    async getUserConversations(userId: string) {
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
                        productData: true,
                        encryptionIv: true,
                        encryptionAuthTag: true,
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

        const processedConversations = conversations.map((conv: any) => {
            const otherParticipants = conv.participants.filter((p: any) => p.userId !== userId);

            if (otherParticipants.length === 0) {
                console.warn('Conversation has no other participant. Conversation:', conv.id, 'All Participants:', conv.participants.map((p: any) => p.user?.email));
                return null;
            }

            const otherParticipant = otherParticipants[0]?.user;

            if (!otherParticipant) {
                return null;
            }

            const currentUserParticipant = conv.participants.find((p: any) => p.userId === userId);

            // parse productData from conversation
            let conversationProductData = null;
            try {
                if (conv.productData) {
                    conversationProductData = JSON.parse(conv.productData);
                }
            } catch (error) {
                conversationProductData = null;
            }

            let lastMessageContent = '';
            let lastMessageProductData = null;

            if (conv.lastMessage) {
                try {
                    // decrypt last message content
                    if (conv.lastMessage.encryptionIv && conv.lastMessage.encryptionAuthTag) {
                        lastMessageContent = this.decryptMessage(
                            conv.lastMessage.content,
                            conv.lastMessage.encryptionIv,
                            conv.lastMessage.encryptionAuthTag
                        );
                    } else {
                        lastMessageContent = conv.lastMessage.content;
                    }

                    // parse productData from last message
                    if (conv.lastMessage.productData) {
                        lastMessageProductData = JSON.parse(conv.lastMessage.productData);
                    }
                } catch (error) {
                    lastMessageContent = '[Encrypted message]';
                    lastMessageProductData = null;
                }
            }


            const result = {
                id: conv.id,
                participant: otherParticipant,
                product: conv.product,
                productData: conversationProductData,
                lastMessage: conv.lastMessage ? {
                    ...conv.lastMessage,
                    content: lastMessageContent,
                    productdata: lastMessageProductData,
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
        }).filter((conv: any): conv is NonNullable<typeof conv> => conv !== null);

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
        const processedMessages = messages.map((message: any) => {

            let parsedProductData = null;
            try {
                // parse product data
                if (message.productData) {
                    parsedProductData = JSON.parse(message.productData);
                }

                // app level decryption
                const plainText = this.decryptMessage(
                    message.content,
                    message.encryptionIv!,
                    message.encryptionAuthTag!
                );

                return {
                    ...message,
                    content: plainText,
                    productData: parsedProductData,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    imageUrl: message.imageUrl,
                    audioUrl: message.audioUrl,
                    formattedTime: this.formatTo12HourTime(message.createdAt)
                };

            } catch (error) {
                return {
                    ...message,
                    content: '[Secure message - decryption failed]',
                    decryptionError: true,
                    productData: parsedProductData,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    imageUrl: message.imageUrl,
                    audioUrl: message.audioUrl,
                    formattedTime: this.formatTo12HourTime(message.createdAt)
                };
            }
        })

        return processedMessages;
    }

    async createConversation(data: CreateConversationData) {
        return await prisma.$transaction(async (tx: any) => {
            // Find conversations where both users are participants
            const possibleConvs = await tx.conversation.findMany({
                where: {
                    participants: {
                        some: { userId: data.creatorId }
                    },
                    AND: [
                        { participants: { some: { userId: data.participantId } } }
                    ]
                },
                include: {
                    participants: true
                }
            });

            // Check if conversation already exists
            const existingConv = possibleConvs.find((conv: any) => conv.participants.length === 2);

            if (existingConv) {
                if (data.productData) {
                    await tx.conversation.update({
                        where: { id: existingConv.id },
                        data: {
                            productData: JSON.stringify(data.productData)
                        }
                    });
                    existingConv.productData = JSON.stringify(data.productData);
                }
                return existingConv;
            }

            const now = new Date();

            // Create new conversation
            const conversation = await tx.conversation.create({
                data: {
                    productId: data.productId || null,
                    productData: data.productData ? JSON.stringify(data.productData) : null,
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
                // encrypt the innitial message
                const appEncrypted = this.encryptMessage(data.initialMessage);

                // database level encryptionfor initial message
                const dbEncryptedContent = await tx.$queryRaw<{ db_encrypted: string }[]>`
                SELECT db_encrypt(${appEncrypted.encrypted}) as db_encrypted
                `;

                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: appEncrypted.encrypted,
                        dbEncryptedContent: dbEncryptedContent[0]?.db_encrypted || null,
                        encryptionIv: appEncrypted.iv,
                        encryptionAuthTag: appEncrypted.authTag,
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

            // parse productData for response
            let parsedProductData = null;
            try {
                if (conversation.productData) {
                    parsedProductData = JSON.parse(conversation.productData);
                }
            } catch (error) {
                parsedProductData = null;
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
                productData: parsedProductData,
                formattedCreatedAt: this.formatTo12HourTime(conversation.createdAt),
                formattedUpdatedAt: this.formatTo12HourTime(conversation.updatedAt)
            };
        });
    }

    async sendMessage(data: MessageData) {
        return await prisma.$transaction(async (tx: any) => {
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

            const receiver = conversation?.participants[0];
            if (!receiver) {
                throw new Error('No receiver found for this conversation');
            }

            let normalizedMessageType: MessageType;
            if (typeof data.messageType === 'string') {
                const upperCaseType = data.messageType.toUpperCase();
                if (upperCaseType in MessageType) {
                    normalizedMessageType = MessageType[upperCaseType as keyof typeof MessageType];
                } else {
                    normalizedMessageType = MessageType.TEXT;
                }
            } else {
                normalizedMessageType = data.messageType;
            }

            const now = new Date();

            // encryption at app level
            const appEncrypted = this.encryptMessage(data.content);

            // Create message
            const message = await tx.message.create({
                data: {
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    content: appEncrypted.encrypted,
                    dbEncryptedContent: null,
                    encryptionIv: appEncrypted.iv,
                    encryptionAuthTag: appEncrypted.authTag,
                    messageType: normalizedMessageType,
                    fileUrl: data.fileUrl,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    imageUrl: data.imageUrl,
                    audioUrl: data.audioUrl,
                    replyToId: data.replyToId,
                    productData: data.productData ? JSON.stringify(data.productData) : null,
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

            // parse productData back to object for response
            let parsedProductData = null;
            try {
                if (message.productData) {
                    parsedProductData = JSON.parse(message.productData);
                }
            } catch (error) {
                parsedProductData = null;
            }

            return {
                ...message,
                content: data.content,
                productData: parsedProductData,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                imageUrl: message.imageUrl,
                audioUrl: message.audioUrl,
                formattedTime: this.formatTo12HourTime(message.createdAt)
            };
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

        return conversations.map((conv: any) => ({
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
            participants: conversation.participants.map((p: any) => p.user),
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