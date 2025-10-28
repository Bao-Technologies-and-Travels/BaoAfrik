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
            console.error('Get conversations error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get conversations'
            });
        }
    };

    createConversationByEmail = async (req: Request, res: Response) => {
        try {
            const creatorId = req.user!.id;
            const { participantEmail, initialMessage, productId } = req.body;

            // validate required fields
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
                return res.status(404).json({ error: 'User not found with this email' });
            }

            // prevent self messaging
            if (participant.id === creatorId) {
                return res.status(400).json({ error: 'You cannot message yourself' });
            }

            const conversation = await this.chatService.createConversationByEmail({
                creatorId,
                participantEmail,
                productId,
                initialMessage
            });

            return res.status(201).json({
                success: true,
                data: conversation
            });
        } catch (error: any) {
            console.error('Create conversation by email error:', error);

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
            const { productId, initialMessage } = req.body;
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
                            lastName: true
                        }
                    }
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (product.seller.id === buyerId) {
                return res.status(422).json({
                    success: false,
                    error: 'Cannot contact yourself'
                });
            }

            // Create conversation
            const conversation = await this.chatService.createConversation({
                creatorId: buyerId,
                participantId: product.seller.id,
                productId: product.id,
                initialMessage
            });

            return res.json({
                success: true,
                data: {
                    conversation,
                    seller: product.seller
                }
            });
        } catch (error: any) {
            console.error('Contact seller error:', error);

            if (error.message.includes('Product not found')) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to contact seller'
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
                            name: true,
                            price: true,
                            location: true,
                            category: true,
                            description: true,
                            images: true
                        }
                    },
                    lastMessage: true
                }
            });

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found'
                });
            }

            return res.json({
                success: true,
                data: conversation
            });
        } catch (error) {
            console.error('Get conversation details error:', error);
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
                return res.status(400).json({ error: 'Conversation ID is required' });
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
            console.error('Get messages error:', error);

            if (error.message.includes('not found') || error.message.includes('access denied')) {
                return res.status(404).json({
                    success: false,
                    error: 'Conversation not found'
                });
            }

            return res.status(500).json({
                success: false,
                error: 'Failed to get messsages'
            });
        }
    };

    // Create new conversation
    createConversation = async (req: Request, res: Response) => {
        try {
            const creatorId = req.user!.id;
            const { participantId, productId, initialMessage } = req.body;

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
                initialMessage
            });

            return res.status(201).json({
                success: true,
                data: conversation
            });
        } catch (error) {
            console.error('Create conversation error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create conversation'
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

            // Validate file size from content-length
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
            console.error('Generate presigned URL error:', error);

            if (error.message.includes('File type not allowed')) {
                return res.status(422).json({
                    success: false,
                    error: 'File type not allowed'
                });
            }

            return res.status(500).json({
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
                return res.status(400).json({ error: 'Conversation ID is required' });
            }

            const updatedMessages = await this.chatService.markMessagesAsRead(conversationId, userId);
            return res.json({
                success: true,
                data: {
                    updatedCount: updatedMessages.length
                }
            });
        } catch (error) {
            console.error('Mark as read error:', error);
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
            console.error('Get unread counts error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get unread counts'
            });
        }
    };
};