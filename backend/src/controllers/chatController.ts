import prisma from '@/config/database';
import { ChatService } from '@/services/chatService';
import { Request, Response } from 'express';

export class ChatController {
    private chatService: ChatService;

    constructor() {
        this.chatService = new ChatService();
    }

    // Get user's conversations
    getConversations = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const page = typeof req.query.page === 'string' ? Math.max(1, parseInt(req.query.page, 10) || 1) : 1;
            const limitRaw = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 20;
            const limit = Math.min(100, Math.max(1, limitRaw || 20));

            const conversations = await this.chatService.getUserConversations(userId);
            const start = (page - 1) * limit;
            const paged = conversations.slice(start, start + limit);

            return res.json({
                success: true,
                data: paged
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get conversations'
            });
        }
    };

    // Get messages for a conversation
    getMessages = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const { conversationId } = req.params;
            const page = typeof req.query.page === 'string' ? Math.max(1, parseInt(req.query.page, 10) || 1) : 1;
            const limitRaw = typeof req.query.limit === 'string' ? parseInt(req.query.limit, 10) : 20;
            const limit = Math.min(100, Math.max(1, limitRaw || 20));
            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }
            const messages = await this.chatService.getMessages(conversationId, page, limit);
            return res.json({
                success: true,
                data: messages
            });
        } catch (error) {
            console.error('Error getting messages:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get messages'
            });
        }
    };

    contactRequest = async (req: Request, res: Response) => {
        try {
            const { requestId, message, productData } = req.body;
            const sellerId = req.user!.id;

            if (!requestId) {
                return res.status(422).json({
                    success: false,
                    error: 'Request ID is required'
                });
            }

            // Get request and requester information
            const request = await prisma.productRequest.findUnique({
                where: { id: requestId },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });

            if (!request) {
                return res.status(404).json({
                    success: false,
                    error: 'Product request not found'
                });
            }

            if (request.userId === sellerId) {
                return res.status(422).json({
                    success: false,
                    error: 'Cannot create conversation with yourself'
                });
            }

            // Create conversation
            const conversation = await this.chatService.createConversation({
                creatorId: sellerId,
                participantId: request.userId,
                productId: null,
                requestId: request.id,
                initialMessage: message,
                productData: productData || {
                    id: request.id,
                    name: request.productName,
                    description: request.description,
                    origin: request.origin,
                    sellerLocation: request.sellerLocation,
                    price: request.minPrice || 0,
                    currency: request.currency || 'USD',
                    isRequest: true,
                    requestData: {
                        minPrice: request.minPrice,
                        maxPrice: request.maxPrice,
                        status: request.status
                    },
                    seller: {
                        id: request.user.id,
                        email: request.user.email,
                        firstName: request.user.firstName,
                        lastName: request.user.lastName,
                        profileImage: request.user.profileImage
                    }
                }
            });

            return res.json({
                success: true,
                data: {
                    conversation,
                    request: {
                        id: request.id,
                        productName: request.productName,
                        status: request.status
                    }
                }
            });
        } catch (error) {
            console.error('Error in contactRequest:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to process contact request'
            });
        }
    };

    contactSeller = async (req: Request, res: Response) => {
        try {
            const { productId, initialMessage, productData: requestProductData } = req.body;
            const buyerId = req.user!.id;

            if (!productId) {
                return res.status(422).json({
                    success: false,
                    error: 'Product ID is required'
                });
            }

            // Get product and seller information
            const product = await prisma.product.findUnique({
                where: { id: productId },
                include: {
                    seller: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                }
            });

            if (!product) {
                return res.status(422).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (product.seller.id === buyerId) {
                return res.status(422).json({
                    success: false,
                    error: 'Cannot create conversation with yourself'
                });
            }

            // Extract image URLs from product.images
            let imageUrls: string[] = [];
            let primaryImage: string | null = null;

            try {
                if (product.images) {
                    const imagesArray = typeof product.images === 'string'
                        ? JSON.parse(product.images)
                        : product.images;

                    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
                        imageUrls = imagesArray
                            .map((img: any) => {
                                if (typeof img === 'string') {
                                    return img;
                                }
                                return img?.url || img?.key || null;
                            })
                            .filter((img): img is string => img !== null);

                        // Get primary image (first image)
                        primaryImage = imageUrls[0] ?? null;
                    }
                }
            } catch (error) {
                console.error('Error parsing product images:', error);
            }

            const productData = {
                id: product.id,
                name: product.title,
                title: product.title,
                price: product.price,
                currency: product.currency || 'USD',
                location: product.location,
                category: product.category,
                description: product.description || '',
                image: primaryImage, // Primary image URL
                images: imageUrls, // All image URLs array
                origin: product.origin,
                quantity: product.quantity,
                deliveryAvailable: product.deliveryAvailable,
                seller: {
                    id: product.seller.id,
                    email: product.seller.email,
                    firstName: product.seller.firstName,
                    lastName: product.seller.lastName,
                    profileImage: product.seller.profileImage
                }
            };

            // Use productData from request if provided, otherwise use the one we constructed
            const finalProductData = requestProductData || productData;

            // Create conversation
            // Only pass initialMessage if provided - message will be sent when user clicks send
            const conversation = await this.chatService.createConversation({
                creatorId: buyerId,
                participantId: product.seller.id,
                productId: product.id,
                initialMessage: initialMessage, // Only send if explicitly provided
                productData: finalProductData
            });

            return res.json({
                success: true,
                data: {
                    conversation,
                    seller: product.seller,
                    product: {
                        id: product.id,
                        name: product.title,
                        price: product.price,
                        images: product.images
                    }
                }
            });
        } catch (error: any) {

            if (error.message === 'Product not found') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (error.message === 'User not found with this email') {
                return res.status(404).json({
                    success: false,
                    error: 'Seller not found'
                });
            }

            if (error.message === 'Cannot create conversation with yourself') {
                return res.status(422).json({
                    success: false,
                    error: 'Cannot create conversation with yourself'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    };

    getConversationDetails = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            // Check if user is a participant in this conversation
            const conversation = await prisma.conversation.findFirst({
                where: {
                    id: conversationId,
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
                            location: true,
                            category: true,
                            description: true,
                            images: true
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
                    }
                }
            });

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found'
                });
            }

            // Format the response with proper time formatting
            const formattedConversation = {
                ...conversation,
                lastMessage: conversation.lastMessage ? {
                    ...conversation.lastMessage,
                    formattedTime: this.chatService['formatTo12HourTime'](conversation.lastMessage.createdAt)
                } : null,
                formattedCreatedAt: this.chatService['formatTo12HourTime'](conversation.createdAt),
                formattedUpdatedAt: this.chatService['formatTo12HourTime'](conversation.updatedAt)
            };

            return res.json({
                success: true,
                data: formattedConversation
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get conversation details'
            });
        }
    };

    // getConversationMessages
    getConversationMessages = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            const messages = await this.chatService.getConversationMessages(
                conversationId,
                userId
            );
            return res.json({
                success: true,
                data: messages
            });
        } catch (error: any) {

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to get messages'
            });
        }
    };

    // Create new conversation
    createConversation = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const creatorId = req.user.id;
            const { participantId, productId, initialMessage, productData } = req.body;

            if (!participantId) {
                return res.status(422).json({
                    success: false,
                    error: 'Participant ID is required'
                });
            }

            const conversation = await this.chatService.createConversation({
                creatorId,
                participantId,
                productId,
                initialMessage,
                productData
            });

            return res.status(201).json({
                success: true,
                data: conversation
            });
        } catch (error: any) {

            if (error.message.includes('Cannot create conversation with yourself')) {
                return res.status(422).json({
                    success: false,
                    error: 'Cannot create conversation with yourself'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to create conversation'
            });
        }
    };

    // Send message
    sendMessage = async (req: Request, res: Response) => {
        try {
            const { conversationId, content, messageType, fileUrl, fileName, fileSize, replyToId, imageUrl, audioUrl, productData } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const senderId = req.user.id;

            const hasText = typeof content === 'string' && content.trim().length > 0;
            const hasMedia = Boolean(fileUrl || imageUrl || audioUrl);
            if (!conversationId || (!hasText && !hasMedia)) {
                return res.status(400).json({
                    success: false,
                    error: 'conversationId and at least one of content or media (file/image/audio) is required'
                });
            }

            const message = await this.chatService.sendMessage({
                conversationId,
                senderId,
                content,
                messageType: messageType || 'TEXT',
                fileUrl,
                fileName,
                fileSize,
                replyToId,
                imageUrl,
                audioUrl,
                productData
            });

            return res.status(201).json({
                success: true,
                data: message
            });
        } catch (error: any) {

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found or access denied'
                });
            }

            if (error.message.includes('No receiver found')) {
                return res.status(404).json({
                    success: false,
                    error: 'No receiver found for this conversation'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to send message'
            });
        }
    };

    // Mark messages as read
    markAsRead = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            const { messageIds } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            await this.chatService.markMessagesAsRead({
                messageIds,
                conversationId,
                userId
            });

            return res.json({ success: true });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to mark messages as read'
            });
        }
    };

    // generate pre-signed URL for file upload
    generatePresignedUrl = async (req: Request, res: Response) => {
        try {
            const { fileName, fileType, fileSize } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!fileName || !fileType) {
                return res.status(400).json({
                    success: false,
                    error: 'File name and type are required'
                });
            }

            const maxSize = 50 * 1024 * 1024; // 50MB
            if (typeof fileSize === 'number' && fileSize > maxSize) {
                return res.status(413).json({
                    success: false,
                    error: 'File size exceeds 50MB limit'
                });
            }

            const presignedUrl = await this.chatService.generatePresignedUrl(
                fileName,
                fileType,
                userId
            );
            return res.json({
                success: true,
                data: presignedUrl
            });
        } catch (error: any) {

            if (error.message.includes('File type not allowed')) {
                return res.status(422).json({
                    success: false,
                    error: 'File type not allowed'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to generate upload URL'
            });
        }
    };

    // Get Unread Count
    getUnreadCounts = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;
            const unreadCounts = await this.chatService.getUnreadCounts(userId);

            return res.json({
                success: true,
                data: unreadCounts
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get unread counts'
            });
        }
    };

    // Get conversation participants
    getConversationParticipants = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            // Verify user has access to this conversation
            const hasAccess = await prisma.conversation.findFirst({
                where: {
                    id: conversationId,
                    participants: {
                        some: {
                            userId: userId
                        }
                    }
                }
            });

            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied to this conversation'
                });
            }

            const result = await this.chatService.getConversationParticipants(conversationId);
            return res.json({
                success: true,
                data: result
            });
        } catch (error: any) {

            if (error.message.includes('Conversation not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to get conversation participants'
            });
        }
    };

    // Add reaction to message
    addReaction = async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;
            const { reaction } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!messageId || !reaction) {
                return res.status(400).json({
                    success: false,
                    error: 'Message ID and reaction are required'
                });
            }

            const result = await this.chatService.addReaction(messageId, userId, reaction);
            return res.json({
                success: true,
                data: result
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to add reaction'
            });
        }
    };

    // Remove reaction from message
    removeReaction = async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!messageId) {
                return res.status(400).json({
                    success: false,
                    error: 'Message ID is required'
                });
            }

            await this.chatService.removeReaction(messageId, userId);
            return res.json({
                success: true,
                message: 'Reaction removed'
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to remove reaction'
            });
        }
    };

    // Update message metadata (pin, archive, important, label)
    updateMessageMetadata = async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;
            const { isPinned, isArchived, isImportant, label } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!messageId) {
                return res.status(400).json({
                    success: false,
                    error: 'Message ID is required'
                });
            }

            const metadata = await this.chatService.updateMessageMetadata(messageId, userId, {
                isPinned,
                isArchived,
                isImportant,
                label
            });

            return res.json({
                success: true,
                data: metadata
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to update message metadata'
            });
        }
    };

    // Get message metadata
    getMessageMetadata = async (req: Request, res: Response) => {
        try {
            const { messageId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!messageId) {
                return res.status(400).json({
                    success: false,
                    error: 'Message ID is required'
                });
            }

            const metadata = await this.chatService.getMessageMetadata(messageId, userId);
            return res.json({
                success: true,
                data: metadata
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to get message metadata'
            });
        }
    };

    // Update conversation metadata (pin, archive, mute, label)
    updateConversationMetadata = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            const { isPinned, isArchived, isMuted, label } = req.body;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            const metadata = await this.chatService.updateConversationMetadata(conversationId, userId, {
                isPinned,
                isArchived,
                isMuted,
                label
            });

            return res.json({
                success: true,
                data: metadata
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to update conversation metadata'
            });
        }
    };

    // Get conversation metadata
    getConversationMetadata = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            const metadata = await this.chatService.getConversationMetadata(conversationId, userId);
            return res.json({
                success: true,
                data: metadata
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to get conversation metadata'
            });
        }
    };

    // Delete conversation
    deleteConversation = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            await this.chatService.deleteConversation(conversationId, userId);
            return res.json({
                success: true,
                message: 'Conversation deleted successfully'
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to delete conversation'
            });
        }
    };

    // Get archived conversations count
    getArchivedCount = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const userId = req.user.id;

            const count = await this.chatService.getArchivedConversationsCount(userId);
            return res.json({
                success: true,
                data: { count }
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to get archived count'
            });
        }
    };

    // Get conversations for a specific product (for product owner)
    getProductConversations = async (req: Request, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, error: 'Unauthorized' });
            }
            const { productId } = req.params;
            const sellerId = req.user.id;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
            }

            const conversations = await this.chatService.getProductConversations(productId, sellerId);
            return res.json({
                success: true,
                data: conversations
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                error: error.message || 'Failed to get product conversations'
            });
        }
    };
}