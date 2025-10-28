import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chatService';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    email: string;
    firstName?: string | null,
    lastName?: string | null,
    profileImage?: string | null;
    isVerifiedSeller: boolean;
    emailVerified?: boolean;
  };
}

export class WebSocketService {
  private io: SocketIOServer;
  private chatService: ChatService;
  private userSockets: Map<string, string> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.chatService = new ChatService();
    this.setupMiddleware();
    this.setupEventHandlers();

    console.log('WebSocketService initialized with existing Socket.io instance');
  }

  private setupMiddleware() {
    this.io.use(this.authenticateSocket.bind(this));
  }

  private async authenticateSocket(socket: AuthenticatedSocket, next: any) {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return next(new Error('JWT secret not configured'));
      }

      const decoded = jwt.verify(token, jwtSecret) as any;

      // Fetch user from database to ensure they exist and are active
      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileImage: true,
          isVerifiedSeller: true,
          emailVerified: true,
        },
      });

      if (!user) {
        return next(new Error('User not found or inactive'));
      }

      if (!user.emailVerified) {
        return next(new Error('Email verification required'));
      }

      (socket as AuthenticatedSocket).user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error('Invalid access token'));
      } else if (error instanceof jwt.TokenExpiredError) {
        return next(new Error('Access token expired'));
      } else {
        return next(new Error('Authentication error'));
      }
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const authenticatedSocket = socket as AuthenticatedSocket;
      if (!authenticatedSocket.user) {
        socket.disconnect();
        return;
      }

      const userId = authenticatedSocket.user.id;
      this.userSockets.set(userId, socket.id);

      console.log(`User ${userId} connected`);

      // Join user to their personal room
      socket.join(userId);
      socket.emit('connected', { userId });

      // Join existing conversations
      this.joinUserConversations(authenticatedSocket, userId);

      // Message events
      socket.on('send_message', async (data) => {
        await this.handleSendMessage(authenticatedSocket, data);
      });

      socket.on('join_conversation', async (conversationId) => {
        await this.handleJoinConversation(authenticatedSocket, conversationId);
      });

      socket.on('typing_start', (data) => {
        this.handleTypingStart(authenticatedSocket, data);
      });

      socket.on('typing_stop', (data) => {
        this.handleTypingStop(authenticatedSocket, data);
      });

      socket.on('mark_as_read', async (data) => {
        await this.handleMarkAsRead(authenticatedSocket, data);
      });

      socket.on('join_conversations', () => {
        this.joinUserConversations(authenticatedSocket, userId);
      });

      socket.on('contact_seller', async (data) => {
        await this.handleContactSeller(authenticatedSocket, data);
      });

      socket.on('disconnect', () => {
        this.userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
      });

      socket.on('error', (error) => {
        console.error(`Socket error for user ${userId}:`, error);
      });
    });
  }

  private async joinUserConversations(socket: AuthenticatedSocket, userId: string) {
    try {
      const conversations = await this.chatService.getUserConversations(userId);
      conversations.forEach(conv => {
        socket.join(`conversation:${conv.id}`);
        console.log(`User ${userId} joined conversation ${conv.id}`)
      });

      socket.join(userId);
      console.log(`User ${userId} joined personal room`);
    } catch (error) {
      console.error('Error joining conversations:', error);
    }
  }

  private async handleJoinConversation(socket: AuthenticatedSocket, conversationId: string) {
    try {
      // Verify user has access to this conversation
      const participants = await this.chatService.getConversationParticipants(conversationId);
      const userHasAccess = participants.some(p => p.id === socket.user!.id);

      if (userHasAccess) {
        socket.join(`conversation:${conversationId}`);
        console.log(`User ${socket.user!.id} joined conversation: ${conversationId}`);

        socket.emit('conversation_joined', { conversationId });
      } else {
        socket.emit('conversation_join_error', { error: 'Access denied' });
      }
    } catch (error) {
      console.error('Error joining conversation:', error);
      socket.emit('conversation_join_error', { error: 'Failed to join conversation' });
    }
  }

  private async handleContactSeller(socket: AuthenticatedSocket, data: any) {
    try {
      const { productId, initialMessage } = data;
      const buyerId = socket.user!.id;

      // Create conversation (using your existing method)
      const conversation = await this.chatService.createConversation({
        creatorId: buyerId,
        participantId: data.sellerId,
        productId,
        initialMessage
      });

      // Notify seller about new conversation
      const sellerSocketId = this.userSockets.get(data.sellerId);
      if (sellerSocketId) {
        this.io.to(sellerSocketId).emit('new_conversation', {
          conversation,
          buyer: {
            id: socket.user!.id,
            firstName: socket.user!.firstName,
            lastName: socket.user!.lastName,
            profileImage: socket.user!.profileImage
          },
          product: data.product
        });
      }

      socket.emit('conversation_created', { conversation });
    } catch (error) {
      console.error('Contact seller error:', error);
      socket.emit('contact_seller_error', { error: 'Failed to contact seller' });
    }
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: any) {
    try {
      console.log('Received send_message event:', {
        conversationId: data.conversationId,
        contentLength: data.content?.length,
        messageType: data.messageType,
        tempId: data.tempId,
        sender: socket.user!.id
      });

      const { conversationId, content, messageType, fileUrl, fileName, fileSize, replyTo, tempId } = data;
      const senderId = socket.user!.id;

      // Validate required fields
      if (!conversationId || !content?.trim()) {
        throw new Error('Conversation ID and content are required');
      }

      // Normalize messageType to uppercase
      const normalizedMessageType = this.normalizeMessageType(messageType);

      const messageData = {
        conversationId,
        senderId,
        content,
        messageType: normalizedMessageType,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined,
        replyToId: replyTo || undefined,
        imageUrl: data.imageUrl || undefined,
        audioUrl: data.audioUrl || undefined
      };

      console.log('Saving message to database:', messageData);

      // Save message to database
      const message = await this.chatService.sendMessage(messageData);

      console.log('Message saved successfully:', {
        messageId: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId
      });

      // Get conversation participants
      const participants = await this.chatService.getConversationParticipants(conversationId);

      // Prepare message response with proper structure
      const messageResponse = {
        ...message,
        tempId,
        sender: {
          id: socket.user!.id,
          email: socket.user!.email,
          firstName: socket.user!.firstName,
          lastName: socket.user!.lastName,
          profileImage: socket.user!.profileImage,
          isVerifiedSeller: socket.user!.isVerifiedSeller
        }
      };

      // Emit to all participants in the conversation
      this.io.to(`conversation:${conversationId}`).emit('new_message', messageResponse);

      // send confirmation to sender with tempId
      socket.emit('message_sent', {
        ...messageResponse,
        tempId
      });

      // Send notifications to other participants
      participants.forEach(participant => {
        if (participant.id !== senderId) {
          const participantSocketId = this.userSockets.get(participant.id);
          if (!participantSocketId) {
            // User is offline, send push notification
            this.sendPushNotification(participant.id, {
              title: `${socket.user!.firstName} ${socket.user!.lastName}`,
              body: content,
              conversationId,
              messageId: message.id
            });
          }

          // Emit new message notification
          this.io.to(participant.id).emit('new_message_notification', {
            conversationId,
            messageId: message.id,
            senderName: `${socket.user!.firstName || ''} ${socket.user!.lastName || ''}`.trim() || socket.user!.email,
            preview: content.substring(0, 100),
            unreadCount: 1
          });
        }
      });

    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('message_error', {
        error: 'Failed to send message',
        tempId: data.tempId
      });
    }
  }

  private normalizeMessageType(messageType: string): string {
    if (typeof messageType === 'string') {
      const upperCaseType = messageType.toUpperCase();
      // Check if it's a valid MessageType
      const validTypes = ['TEXT', 'FILE', 'IMAGE', 'AUDIO', 'VIDEO'];
      if (validTypes.includes(upperCaseType)) {
        return upperCaseType;
      }
    }
    return 'TEXT'; // Default to TEXT
  }

  private handleTypingStart(socket: AuthenticatedSocket, data: any) {
    const { conversationId } = data;
    const userId = socket.user!.id;

    socket.to(`conversation:${conversationId}`).emit('user_typing', {
      conversationId,
      userId,
      userName: `${socket.user!.firstName} ${socket.user!.lastName}`
    });
  }

  private handleTypingStop(socket: AuthenticatedSocket, data: any) {
    const { conversationId } = data;
    const userId = socket.user!.id;

    socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
      conversationId,
      userId
    });
  }

  private async handleMarkAsRead(socket: AuthenticatedSocket, data: any) {
    try {
      const { conversationId } = data;
      const userId = socket.user!.id;

      const updatedMessages = await this.chatService.markMessagesAsRead(conversationId, userId);

      // Notify other participants that messages were read
      socket.to(`conversation:${conversationId}`).emit('messages_read', {
        conversationId,
        readerId: userId,
        messageIds: updatedMessages.map(m => m.id)
      });

    } catch (error) {
      console.error('Mark as read error:', error);
      socket.emit('read_error', { error: 'Failed to mark messages as read' });
    }
  }

  private async sendPushNotification(userId: string, notification: any) {
    // Implement your push notification service
    console.log('Sending push notification to user:', userId, notification);
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}