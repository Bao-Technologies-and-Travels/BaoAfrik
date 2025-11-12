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
            const userId = req.user!.id;
            const conversations = await this.chatService.getUserConversations(userId);
            return res.json({
                success: true,
                data: conversations
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to get conversations'
            });
        }
    };

    createConversationByEmail = async (req: Request, res: Response) => {
        try {
            const creatorId = req.user!.id;
            const { participantEmail, initialMessage, productId, productData } = req.body;

            if (!participantEmail) {
                return res.status(422).json({
                    success: false,
                    error: 'Participant email is required'
                });
            }

            const participant = await prisma.user.findUnique({
                where: {
                    email: participantEmail,
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                }
            });

            if (!participant) {
                return res.status(404).json({ 
                    success: false,
                    error: 'User not found with this email' 
                });
            }

            // prevent self messaging
            if (participant.id === creatorId) {
                return res.status(400).json({ 
                    success: false,
                    error: 'You cannot message yourself' 
                });
            }

            const conversation = await this.chatService.createConversationByEmail({
                creatorId,
                participantEmail,
                productId,
                initialMessage, 
                productData
            });

            return res.status(201).json({
                success: true,
                data: conversation
            });
        } catch (error: any) {

            if (error.message.includes('User not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found with this email'
                });
            }

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

    contactSeller = async (req: Request, res: Response) => {
        try {
            const { productId } = req.body;
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
                    }
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

            const productData = {
                id: product.id,
                name: product.title,
                price: product.price,
                location: product.location,
                category: product.category,
                description: product.description,
                images: product.images,
                seller: {
                    id: product.seller.id,
                    email: product.seller.email,
                    firstName: product.seller.firstName,
                    lastName: product.seller.lastName,
                    profileImage: product.seller.profileImage
                }
            };

            // Create conversation
            const conversation = await this.chatService.createConversationByEmail({
                creatorId: buyerId,
                participantEmail: product.seller.email,
                productId: product.id,
                initialMessage: "",
                productData: productData
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
                error: 'Internal server error' + error.message
            });
        }
    };

    getConversationDetails = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            const userId = req.user!.id;

            if (!conversationId) {
                return res.status(400).json({
                    success: false,
                    error: 'Conversation ID is required'
                });
            }

            // Check if user is a participant in this conversation
            const conversation = await prisma.conversation.findUnique({
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
            const userId = req.user!.id;

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
            const creatorId = req.user!.id;
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
            const senderId = req.user!.id;

            if (!conversationId || !content) {
                return res.status(422).json({
                    success: false,
                    error: 'Conversation ID and content are required'
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

    // generate pre-signed URL for file upload
    generatePresignedUrl = async (req: Request, res: Response) => {
        try {
            const { fileName, fileType } = req.body;
            const userId = req.user!.id;

            if (!fileName || !fileType) {
                return res.status(422).json({
                    success: false,
                    error: 'File name and type are required'
                });
            }

            const contentLength = parseInt(req.headers['content-length'] || '0');
            const maxSize = 50 * 1024 * 1024; // 50MB

            if (contentLength > maxSize) {
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

    // mark messages as read
    markAsRead = async (req: Request, res: Response) => {
        try {
            const { conversationId } = req.params;
            const userId = req.user!.id;

            if (!conversationId) {
                return res.status(400).json({ 
                    success: false,
                    error: 'Conversation ID is required' 
                });
            }

            const result = await this.chatService.markMessagesAsRead(conversationId, userId);
            return res.json({
                success: true,
                data: {
                    updatedCount: result.unreadMessages.length,
                    markReadAt: result.markReadAt
                }
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: 'Failed to mark messages as read'
            });
        }
    };

    // Get Unread Count
    getUnreadCounts = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
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
            const userId = req.user!.id;

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
}