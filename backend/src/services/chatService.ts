import prisma from '@/config/database'; import { MessageType } from '../generated/client';
// import { s3Service } from './s3Service';
import { gcpStorageService } from './gcpStorageService';
import crypto from 'crypto';

export interface CreateConversationData {
    creatorId: string;
    participantId: string;
    productId?: string | null;
    requestId?: string | null;
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
    private algorithm = 'aes-256-gcm';
    private encryptionKey: Buffer;
    private dbEncryptionEnabled: boolean = false

    constructor() {
        this.encryptionKey = crypto.scryptSync(
            process.env.APP_ENCRYPTION_KEY!,
            'app-salt',
            32
        );

    }

    // app level encryption
    private encryptMessage(content: string): { encrypted: string, encryptionIv: string, encryptionAuthTag: string } {
        const encryptionIv = crypto.randomBytes(16);
        const cipher: crypto.CipherGCM = crypto.createCipheriv(this.algorithm, this.encryptionKey, encryptionIv) as crypto.CipherGCM;

        let encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const encryptionAuthTag = cipher.getAuthTag().toString('hex');

        return { encrypted, encryptionIv: encryptionIv.toString('hex'), encryptionAuthTag };
    }

    // app level decryption
    private decryptMessage(encryptedData: string, encryptionIv: string, encryptionAuthTag: string): string {
        try {
            const decipher: crypto.DecipherGCM = crypto.createDecipheriv(
                this.algorithm,
                this.encryptionKey,
                Buffer.from(encryptionIv, 'hex')
            ) as crypto.DecipherGCM;

            decipher.setAuthTag(Buffer.from(encryptionAuthTag, 'hex'));

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
        let decryptedContent = '';
        try {
            const conversations = await prisma.conversation.findMany({
                where: {
                    participants: {
                        some: {
                            userId: userId,
                        }
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
                                    email: true,
                                    location: true,
                                    createdAt: true,
                                    bio: true,
                                    rating: true
                                }
                            }
                        }
                    },
                    messages: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1
                    },
                    product: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            currency: true,
                            images: true,
                            status: true
                        }
                    },
                    lastMessage: {
                        include: {
                            statuses: {
                                include: {
                                    user: {
                                        select: {
                                            id: true
                                        }
                                    }
                                }
                            },
                            reactions: {
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
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });

            // Get unread counts for all conversations
            const conversationIds = conversations.map(c => c.id);
            const unreadCounts = await prisma.message.groupBy({
                by: ['conversationId'],
                where: {
                    conversationId: { in: conversationIds },
                    senderId: { not: userId },
                    readAt: null
                },
                _count: {
                    id: true
                }
            });

            const unreadCountMap = new Map(
                unreadCounts.map(uc => [uc.conversationId, uc._count.id])
            );

            return conversations.map(conversation => {
                const otherParticipant = conversation.participants.find(
                    p => p.userId !== userId
                )?.user;

                const lastMessage = conversation.lastMessage || conversation.messages[0] || null;

                let decryptedContent = '';
                if (lastMessage) {
                    try {
                        // Always decrypt the content field (it's app-level encrypted)
                        if (lastMessage.encryptionIv && lastMessage.encryptionAuthTag && lastMessage.content) {
                            decryptedContent = this.decryptMessage(
                                lastMessage.content,
                                lastMessage.encryptionIv,
                                lastMessage.encryptionAuthTag
                            );
                        } else if (lastMessage.dbEncryptedContent && lastMessage.encryptionIv && lastMessage.encryptionAuthTag) {
                            // Fallback to dbEncryptedContent if available
                            decryptedContent = this.decryptMessage(
                                lastMessage.dbEncryptedContent,
                                lastMessage.encryptionIv,
                                lastMessage.encryptionAuthTag
                            );
                        } else {
                            decryptedContent = 'Encrypted message';
                        }
                    } catch (error) {
                        decryptedContent = 'Encrypted message';
                    }
                }

                // Extract voice message properties from productData for lastMessage
                let voiceDuration = null;
                let waveformData = null;
                if (lastMessage?.productData) {
                    try {
                        const parsedProductData = typeof lastMessage.productData === 'string'
                            ? JSON.parse(lastMessage.productData)
                            : lastMessage.productData;
                        if (parsedProductData && typeof parsedProductData === 'object') {
                            voiceDuration = parsedProductData._voiceDuration || parsedProductData.voiceDuration || null;
                            waveformData = parsedProductData._waveformData || parsedProductData.waveformData || null;
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }

                return {
                    id: conversation.id,
                    product: conversation.product,
                    otherParticipant: otherParticipant || {
                        id: 'unknown',
                        firstName: 'Unknown',
                        lastName: 'User',
                        profileImage: null,
                        email: 'unknown@example.com'
                    },
                    lastMessage: lastMessage ? {
                        ...lastMessage,
                        content: decryptedContent,
                        duration: voiceDuration,
                        waveformData: waveformData
                    } : null,
                    unreadCount: unreadCountMap.get(conversation.id) || 0,
                    updatedAt: conversation.updatedAt
                };
            });
        } catch (error) {
            throw new Error('Failed to fetch conversations');
        }
    }

    async getProductConversations(productId: string, sellerId: string) {
        try {
            // Verify the product belongs to the seller
            const product = await prisma.product.findFirst({
                where: {
                    id: productId,
                    sellerId: sellerId
                }
            });

            if (!product) {
                throw new Error('Product not found or unauthorized');
            }

            // Get all conversations for this product
            const conversations = await prisma.conversation.findMany({
                where: {
                    productId: productId
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
                                    rating: true
                                }
                            }
                        }
                    },
                    lastMessage: {
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true
                                }
                            }
                        }
                    },
                    messages: {
                        orderBy: {
                            createdAt: 'desc'
                        },
                        take: 1,
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });

            // Process conversations to get unique buyers and their info
            const processedConversations = conversations.map(conversation => {
                // Find the buyer (participant who is not the seller)
                const buyer = conversation.participants.find(
                    p => p.userId !== sellerId
                )?.user;

                const lastMessage = conversation.lastMessage || conversation.messages[0] || null;
                let decryptedContent = '';

                if (lastMessage) {
                    try {
                        if (lastMessage.encryptionIv && lastMessage.encryptionAuthTag && lastMessage.content) {
                            decryptedContent = this.decryptMessage(
                                lastMessage.content,
                                lastMessage.encryptionIv,
                                lastMessage.encryptionAuthTag
                            );
                        } else if (lastMessage.dbEncryptedContent && lastMessage.encryptionIv && lastMessage.encryptionAuthTag) {
                            decryptedContent = this.decryptMessage(
                                lastMessage.dbEncryptedContent,
                                lastMessage.encryptionIv,
                                lastMessage.encryptionAuthTag
                            );
                        } else {
                            decryptedContent = 'Encrypted message';
                        }
                    } catch (error) {
                        decryptedContent = 'Encrypted message';
                    }
                }

                // Determine message state
                let messageState: 'new' | 'read' | 'you' = 'read';
                if (lastMessage) {
                    if (lastMessage.senderId === sellerId) {
                        messageState = 'you';
                    } else if (!lastMessage.isRead) {
                        messageState = 'new';
                    }
                }

                // Extract voice message properties from productData for lastMessage
                let voiceDuration = null;
                let waveformData = null;
                if (lastMessage?.productData) {
                    try {
                        const parsedProductData = typeof lastMessage.productData === 'string'
                            ? JSON.parse(lastMessage.productData)
                            : lastMessage.productData;
                        if (parsedProductData && typeof parsedProductData === 'object') {
                            voiceDuration = parsedProductData._voiceDuration || parsedProductData.voiceDuration || null;
                            waveformData = parsedProductData._waveformData || parsedProductData.waveformData || null;
                        }
                    } catch (e) {
                        // Ignore parsing errors
                    }
                }

                return {
                    id: conversation.id,
                    buyer: buyer || null,
                    lastMessage: lastMessage ? {
                        ...lastMessage,
                        content: decryptedContent,
                        preview: decryptedContent.length > 50 ? decryptedContent.substring(0, 50) + '...' : decryptedContent,
                        duration: voiceDuration,
                        waveformData: waveformData
                    } : null,
                    messageState,
                    timestamp: lastMessage?.createdAt ? this.formatMessageTimestamp(lastMessage.createdAt) : '',
                    updatedAt: conversation.updatedAt
                };
            }).filter(conv => conv.buyer !== null); // Only return conversations with valid buyers

            return processedConversations;
        } catch (error: any) {
            throw new Error(`Failed to fetch product conversations: ${error.message}`);
        }
    }

    private formatMessageTimestamp(date: Date): string {
        const now = new Date();
        const messageDate = new Date(date);
        const diffTime = Math.abs(now.getTime() - messageDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today, ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } else if (diffDays === 1) {
            return 'Yesterday, ' + messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        } else {
            return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
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
            where: {
                conversationId: conversationId
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
                replyTo: {
                    select: {
                        id: true,
                        content: true,
                        encryptionIv: true,
                        encryptionAuthTag: true,
                        messageType: true,
                        audioUrl: true,
                        createdAt: true,
                        sender: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        }
                    }
                },
                statuses: {
                    where: {
                        userId: userId
                    }
                },
                reactions: {
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
                metadata: {
                    where: {
                        userId: userId
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
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

                // Get user's reaction if exists
                const userReaction = message.reactions?.find((r: any) => r.userId === userId);
                // Get user's metadata if exists
                const userMetadata = message.metadata?.find((m: any) => m.userId === userId);

                // Extract voice message properties from productData if present
                let voiceDuration = null;
                let waveformData = null;

                if (parsedProductData && typeof parsedProductData === 'object') {
                    voiceDuration = parsedProductData._voiceDuration || parsedProductData.voiceDuration || null;
                    waveformData = parsedProductData._waveformData || parsedProductData.waveformData || null;

                }

                // Decrypt replyTo content if present
                let decryptedReplyTo = message.replyTo;
                if (message.replyTo && message.replyTo.content && message.replyTo.encryptionIv && message.replyTo.encryptionAuthTag) {
                    try {
                        const decryptedReplyContent = this.decryptMessage(
                            message.replyTo.content,
                            message.replyTo.encryptionIv,
                            message.replyTo.encryptionAuthTag
                        );
                        decryptedReplyTo = {
                            ...message.replyTo,
                            content: decryptedReplyContent
                        };
                    } catch (replyDecryptError) {
                        console.error('Failed to decrypt replyTo content:', replyDecryptError);
                        decryptedReplyTo = {
                            ...message.replyTo,
                            content: '[Encrypted message]'
                        };
                    }
                }

                return {
                    ...message,
                    content: plainText,
                    replyTo: decryptedReplyTo,
                    productData: parsedProductData,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    imageUrl: message.imageUrl,
                    audioUrl: message.audioUrl,
                    // Include voice message properties
                    duration: voiceDuration || message.duration || null,
                    waveformData: waveformData || message.waveformData || null,
                    reaction: userReaction?.reaction || null,
                    reactions: message.reactions || [],
                    isPinned: userMetadata?.isPinned || false,
                    isArchived: userMetadata?.isArchived || false,
                    isImportant: userMetadata?.isImportant || false,
                    isDeletedForMe: userMetadata?.isDeletedForMe || false,
                    label: userMetadata?.label || null,
                    formattedTime: this.formatTo12HourTime(message.createdAt)
                };

            } catch (error) {
                // Extract voice message properties from productData even on error
                let voiceDuration = null;
                let waveformData = null;
                if (parsedProductData && typeof parsedProductData === 'object') {
                    voiceDuration = parsedProductData._voiceDuration || parsedProductData.voiceDuration || null;
                    waveformData = parsedProductData._waveformData || parsedProductData.waveformData || null;
                }

                // Try to decrypt replyTo content even if main content decryption failed
                let decryptedReplyTo = message.replyTo;
                if (message.replyTo && message.replyTo.content && message.replyTo.encryptionIv && message.replyTo.encryptionAuthTag) {
                    try {
                        const decryptedReplyContent = this.decryptMessage(
                            message.replyTo.content,
                            message.replyTo.encryptionIv,
                            message.replyTo.encryptionAuthTag
                        );
                        decryptedReplyTo = {
                            ...message.replyTo,
                            content: decryptedReplyContent
                        };
                    } catch (replyDecryptError) {
                        decryptedReplyTo = {
                            ...message.replyTo,
                            content: '[Encrypted message]'
                        };
                    }
                }

                return {
                    ...message,
                    content: '[Secure message - decryption failed]',
                    decryptionError: true,
                    replyTo: decryptedReplyTo,
                    productData: parsedProductData,
                    fileUrl: message.fileUrl,
                    fileName: message.fileName,
                    fileSize: message.fileSize,
                    imageUrl: message.imageUrl,
                    audioUrl: message.audioUrl,
                    // Include voice message properties
                    duration: voiceDuration || message.duration || null,
                    waveformData: waveformData || message.waveformData || null,
                    reaction: null,
                    reactions: [],
                    isPinned: false,
                    isArchived: false,
                    isImportant: false,
                    label: null,
                    formattedTime: this.formatTo12HourTime(message.createdAt)
                };
            }
        })

        return processedMessages;
    }

    async getConversationById(conversationId: string) {
        return await prisma.conversation.findUnique({
            where: { id: conversationId },
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
                }
            }
        });
    }

    async createMessage(data: {
        conversationId: string;
        senderId: string;
        content: string;
        messageType: string;
    }) {
        const { conversationId, senderId, content, messageType } = data;

        // Encrypt message content
        const { encrypted, encryptionIv, encryptionAuthTag } = this.encryptMessage(content);

        const message = await prisma.message.create({
            data: {
                content: encrypted,
                encryptionIv: encryptionIv,
                encryptionAuthTag: encryptionAuthTag,
                messageType: messageType as any,
                conversation: { connect: { id: conversationId } },
                sender: { connect: { id: senderId } },
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        return {
            ...message,
            content
        };
    }

    async markMessagesAsRead(data: {
        messageIds: string[];
        conversationId: string | undefined;
        userId: string;
    }) {
        const { messageIds, conversationId, userId } = data;

        await prisma.message.updateMany({
            where: {
                id: { in: messageIds },
                conversationId,
                senderId: { not: userId },
                readAt: null
            },
            data: {
                readAt: new Date()
            }
        });
    }

    private async checkDbEncryptAvailable(): Promise<boolean> {
        try {
            const testMessage = 'test-' + Date.now();
            const result = await prisma.$queryRaw<Array<{ encrypted: string }>>`SELECT db_encrypt(${testMessage}) as encrypted`;
            const encrypted = result[0]?.encrypted;
            if (!encrypted) {
                throw new Error('No result from db_encrypt');
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async createConversation(data: CreateConversationData) {
        // Check if db_encrypt function exists (outside transaction)
        const dbEncryptAvailable = await this.checkDbEncryptAvailable();

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
            // const existingConv = possibleConvs.find((conv: any) => conv.participants.length === 2);

            // if (existingConv) {
            //     if (data.productData) {
            //         await tx.conversation.update({
            //             where: { id: existingConv.id },
            //             data: {
            //                 productData: JSON.stringify(data.productData)
            //             }
            //         });
            //         existingConv.productData = JSON.stringify(data.productData);
            //     }
            //     return existingConv;
            // }

            const now = new Date();

            // Create new conversation with request data
            const conversationData: any = {
                participants: {
                    create: [
                        { userId: data.creatorId },
                        { userId: data.participantId }
                    ]
                },
                createdAt: now,
                updatedAt: now
            };

            // Add productId or requestId based on what's provided
            if (data.productId) {
                conversationData.productId = data.productId;
            }
            if (data.requestId) {
                conversationData.requestId = data.requestId;
                // Store product data as string in the conversation
                if (data.productData) {
                    conversationData.productData = JSON.stringify(data.productData);
                }
            }

            const conversation = await tx.conversation.create({
                data: conversationData,
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

                // Use database encryption if available, otherwise use app-level encryption only
                let dbEncryptedContent = null;
                if (dbEncryptAvailable) {
                    try {
                        const result = await tx.$queryRaw<{ db_encrypted: string }[]>`
                        SELECT db_encrypt(${appEncrypted.encrypted}) as db_encrypted
                        `;
                        dbEncryptedContent = result[0]?.db_encrypted || null;
                    } catch (error) {
                        dbEncryptedContent = null;
                    }
                }

                const initialMessage = await tx.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: data.creatorId,
                        content: appEncrypted.encrypted,
                        dbEncryptedContent: dbEncryptedContent,
                        encryptionIv: appEncrypted.encryptionIv,
                        encryptionAuthTag: appEncrypted.encryptionAuthTag,
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
            let parsedProductData = data.productData || null;
            if (!parsedProductData && conversation.productData) {
                try {
                    parsedProductData = JSON.parse(conversation.productData);
                } catch (error) {
                    parsedProductData = null;
                }
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
                let upperCaseType = data.messageType.toUpperCase();
                // Map VOICE to AUDIO since VOICE is not in the Prisma enum
                if (upperCaseType === 'VOICE') {
                    upperCaseType = 'AUDIO';
                }
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
                    encryptionIv: appEncrypted.encryptionIv,
                    encryptionAuthTag: appEncrypted.encryptionAuthTag,
                    messageType: normalizedMessageType,
                    fileUrl: data.fileUrl,
                    fileName: data.fileName,
                    fileSize: data.fileSize,
                    imageUrl: data.imageUrl,
                    audioUrl: data.audioUrl,
                    replyToId: data.replyToId,
                    productData: data.productData ? JSON.stringify(data.productData) : null,
                    createdAt: now,
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
                    replyTo: {
                        include: {
                            sender: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    profileImage: true
                                }
                            }
                        }
                    }
                },

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

        if (!allowedMimeTypes.includes(fileType)) {
            throw new Error('File type not allowed');
        }

        const presigned = await gcpStorageService.generateSignedUrl(
            fileName,
            fileType,
            'chat',
            userId
        );

        return {
            presignedUrl: (presigned as any).uploadUrl,
            key: presigned.key,
            url: presigned.viewUrl,
            generatedAt: this.formatTo12HourTime(new Date())
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

    async getMessages(conversationId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const messages = await prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
            include: {
                sender: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });
        // Decrypt messages and parse productData for voice messages
        return messages.map(msg => {
            let parsedProductData = null;
            let voiceDuration = null;
            let waveformData = null;

            // Parse productData if present
            if (msg.productData) {
                try {
                    parsedProductData = JSON.parse(msg.productData);
                    // Extract voice message properties
                    if (parsedProductData && typeof parsedProductData === 'object') {
                        voiceDuration = parsedProductData._voiceDuration || parsedProductData.voiceDuration || null;
                        waveformData = parsedProductData._waveformData || parsedProductData.waveformData || null;
                    }
                } catch (e) {
                    // Ignore parse errors
                }
            }

            return {
                ...msg,
                content: this.decryptMessage(msg.content, msg.encryptionIv, msg.encryptionAuthTag),
                productData: parsedProductData,
                duration: voiceDuration || null,
                waveformData: waveformData || null
            };
        });
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

    async updateMessageStatus(messageId: string, userId: string, status: 'SENDING' | 'SENT' | 'DELIVERED' | 'READ') {
        try {
            // update or create messsage status
            await prisma.messageStatus.upsert({
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
                    status,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });

            // get updated message with status
            const message = await prisma.message.findUnique({
                where: { id: messageId },
                include: {
                    statuses: true
                }
            });
            return message;
        } catch (error) {
            throw new Error('Failed to update message status');
        }
    }

    async addReaction(messageId: string, userId: string, reaction: string) {
        try {
            const messageReaction = await prisma.messageReaction.upsert({
                where: {
                    messageId_userId: {
                        messageId,
                        userId
                    }
                },
                update: {
                    reaction,
                    updatedAt: new Date()
                },
                create: {
                    messageId,
                    userId,
                    reaction,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                    message: {
                        include: {
                            reactions: {
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
                            }
                        }
                    }
                }
            });
            return messageReaction;
        } catch (error) {
            throw new Error('Failed to add reaction');
        }
    }

    async removeReaction(messageId: string, userId: string) {
        try {
            await prisma.messageReaction.deleteMany({
                where: {
                    messageId,
                    userId
                }
            });
            return { success: true };
        } catch (error) {
            throw new Error('Failed to remove reaction');
        }
    }

    async updateMessageMetadata(messageId: string, userId: string, data: {
        isPinned?: boolean;
        isArchived?: boolean;
        isImportant?: boolean;
        isDeletedForMe?: boolean;
        label?: string | null;
    }) {
        try {
            const metadata = await prisma.messageMetadata.upsert({
                where: {
                    messageId_userId: {
                        messageId,
                        userId
                    }
                },
                update: {
                    ...data,
                    updatedAt: new Date()
                },
                create: {
                    messageId,
                    userId,
                    isPinned: data.isPinned || false,
                    isArchived: data.isArchived || false,
                    isImportant: data.isImportant || false,
                    isDeletedForMe: data.isDeletedForMe || false,
                    label: data.label || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return metadata;
        } catch (error) {
            throw new Error('Failed to update message metadata');
        }
    }

    async getMessageMetadata(messageId: string, userId: string) {
        try {
            const metadata = await prisma.messageMetadata.findUnique({
                where: {
                    messageId_userId: {
                        messageId,
                        userId
                    }
                }
            });
            return metadata;
        } catch (error) {
            throw new Error('Failed to get message metadata');
        }
    }

    async updateConversationMetadata(conversationId: string, userId: string, data: {
        isPinned?: boolean;
        isArchived?: boolean;
        isMuted?: boolean;
        label?: string | null;
    }) {
        try {
            const metadata = await prisma.conversationMetadata.upsert({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId
                    }
                },
                update: {
                    ...data,
                    updatedAt: new Date()
                },
                create: {
                    conversationId,
                    userId,
                    isPinned: data.isPinned || false,
                    isArchived: data.isArchived || false,
                    isMuted: data.isMuted || false,
                    label: data.label || null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
            return metadata;
        } catch (error) {
            throw new Error('Failed to update conversation metadata');
        }
    }

    async getConversationMetadata(conversationId: string, userId: string) {
        try {
            const metadata = await prisma.conversationMetadata.findUnique({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId
                    }
                }
            });
            return metadata;
        } catch (error) {
            throw new Error('Failed to get conversation metadata');
        }
    }

    async deleteConversation(conversationId: string, userId: string) {
        try {
            // Check if conversation exists first
            const conversation = await prisma.conversation.findUnique({
                where: { id: conversationId },
                include: {
                    participants: {
                        where: { userId }
                    }
                }
            });

            if (!conversation) {
                // Conversation already deleted, return success
                return { success: true, alreadyDeleted: true };
            }

            if (conversation.participants.length === 0) {
                throw new Error('User is not a participant in this conversation');
            }

            // Delete the conversation (cascade will handle related records)
            await prisma.conversation.delete({
                where: {
                    id: conversationId
                }
            });

            return { success: true };
        } catch (error: any) {
            // Handle "record not found" error gracefully
            if (error?.code === 'P2025' || error?.message?.includes('not found')) {
                return { success: true, alreadyDeleted: true };
            }
            throw new Error('Failed to delete conversation');
        }
    }

    async getArchivedConversationsCount(userId: string) {
        try {
            const count = await prisma.conversationMetadata.count({
                where: {
                    userId,
                    isArchived: true
                }
            });
            return count;
        } catch (error) {
            throw new Error('Failed to get archived conversations count');
        }
    }
}