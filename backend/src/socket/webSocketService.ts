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
  private connectedUsers: Map<string, AuthenticatedSocket> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.chatService = new ChatService();
    this.setupMiddleware();
    this.setupEventHandlers();
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

      socket.user = user;
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
      const userEmail = authenticatedSocket.user.email;

      console.log(`WebSocket connection established for user: ${userEmail} (${userId})`);

      // store user connection
      this.userSockets.set(userId, socket.id);
      this.connectedUsers.set(userId, authenticatedSocket);

      // Join user to their personal room
      socket.join(userId);
      socket.emit('connected', {
        userId,
        message: 'WebSocket connected successfully'
      });

      // Join existing conversations
      this.joinUserConversations(authenticatedSocket, userId);

      // Message events
      socket.on('send_message', async (data, callback) => {
        console.log('📤 Send message event received:', {
          conversationId: data.conversationId,
          sender: userEmail,
          tempId: data.tempId
        });
        await this.handleSendMessage(authenticatedSocket, data, callback);
      });

      socket.on('join_conversation', async (conversationId) => {
        console.log('🔗 Join conversation event:', { conversationId, user: userEmail });
        await this.handleJoinConversation(authenticatedSocket, conversationId);
      });

      socket.on('typing_start', (data) => {
        console.log('⌨️ Typing start:', { conversationId: data.conversationId, user: userEmail });
        this.handleTypingStart(authenticatedSocket, data);
      });

      socket.on('typing_stop', (data) => {
        console.log('⏹️ Typing stop:', { conversationId: data.conversationId, user: userEmail });
        this.handleTypingStop(authenticatedSocket, data);
      });

      socket.on('mark_as_read', async (data) => {
        console.log('📖 Mark as read:', { conversationId: data, user: userEmail });
        await this.handleMarkAsRead(authenticatedSocket, data);
      });

      socket.on('join_conversations', () => {
        console.log('🔄 Join conversations request:', userEmail);
        this.joinUserConversations(authenticatedSocket, userId);
      });

      socket.on('contact_seller', async (data) => {
        console.log('📞 Contact seller:', { sellerId: data.sellerId, user: userEmail });
        await this.handleContactSeller(authenticatedSocket, data);
      });

      socket.on('disconnect', (reason) => {
        console.log(`🔌 WebSocket disconnected for user ${userEmail}:`, reason);
        this.userSockets.delete(userId);
        this.connectedUsers.delete(userId);
      });

      socket.on('error', (error) => {
        console.error(`Socket error for user ${userId}:`, error);
      });

      // Heartbeat to keep connection alive
      socket.on('ping', (cb) => {
        if (typeof cb === 'function') {
          cb('pong');
        }
      });
    });
  }

  private async joinUserConversations(socket: AuthenticatedSocket, userId: string) {
    try {
      const conversations = await this.chatService.getUserConversations(userId);
      console.log(`👥 User ${userId} has ${conversations.length} conversations to join`);

      conversations.forEach(conv => {
        socket.join(`conversation:${conv.id}`);
        console.log(`✅ User joined conversation: ${conv.id}`);
      });

      socket.join(userId);
      console.log(`✅ User ${userId} joined their personal room`);
    } catch (error) {
      console.error('Error joining conversations:', error);
    }
  }

  private async handleJoinConversation(socket: AuthenticatedSocket, conversationId: string) {
    try {
      if (!conversationId) {
        socket.emit('conversation_join_error', { error: 'Conversation ID is required' });
        return;
      }

      // Verify user has access to this conversation
      const participantsResult = await this.chatService.getConversationParticipants(conversationId);
      const participants = participantsResult.participants; // Extract the participants array
      const userHasAccess = participants.some((p: any) => p.id === socket.user!.id);

      if (userHasAccess) {
        socket.join(`conversation:${conversationId}`);
        console.log(`✅ User ${socket.user!.email} joined conversation: ${conversationId}`);

        socket.emit('conversation_joined', {
          conversationId,
          participants: participants.map((p: any) => ({
            id: p.id,
            email: p.email || 'unknown@gmail.com',
            firstName: p.firstName,
            lastName: p.lastName
          }))
        });
      } else {
        console.log(`❌ Access denied for user ${socket.user!.email} to conversation ${conversationId}`);
        socket.emit('conversation_join_error', { error: 'Access denied' });
      }
    } catch (error) {
      console.error('❌ Error joining conversation:', error);
      socket.emit('conversation_join_error', { error: 'Failed to join conversation' });
    }
  }

  private async handleContactSeller(socket: AuthenticatedSocket, data: any) {
    try {
      const { productId, initialMessage, sellerId } = data;
      const buyerId = socket.user!.id;

      if (!sellerId || !productId) {
        throw new Error('Seller ID and Product ID are required');
      }

      console.log(`📞 Contacting seller ${sellerId} for product ${productId} from buyer ${buyerId}`);

      // Create conversation
      const conversation = await this.chatService.createConversation({
        creatorId: buyerId,
        participantId: data.sellerId,
        productId,
        initialMessage
      });

      // Notify seller about new conversation
      const sellerSocketId = this.userSockets.get(sellerId);
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
        console.log(`📨 Notified seller ${sellerId} about new conversation`);
      }

      socket.emit('conversation_created', { conversation });
      console.log(`✅ Conversation created: ${conversation.id}`);

    } catch (error: any) {
      console.error('❌ Contact seller error:', error);
      socket.emit('contact_seller_error', { error: error.message || 'Failed to contact seller' });
    }
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: any, callback?: Function) {
    try {
      const { conversationId, content, messageType, fileUrl, fileName, fileSize, replyTo, tempId } = data;
      const senderId = socket.user!.id;
      const senderEmail = socket.user!.email;

      console.log('📤 Processing message send:', {
        conversationId,
        sender: senderEmail,
        contentLength: content?.length,
        messageType,
        tempId
      });

      // Validate required fields
      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      if (!content?.trim() && !fileUrl) {
        throw new Error('Message content or file is required');
      }

      // Normalize messageType to uppercase
      const normalizedMessageType = this.normalizeMessageType(messageType);

      const messageData = {
        conversationId,
        senderId,
        content: content?.trim() || `Sent ${fileName || 'file'}`,
        messageType: normalizedMessageType,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        fileSize: fileSize || undefined,
        replyToId: replyTo || undefined,
        imageUrl: data.imageUrl || undefined,
        audioUrl: data.audioUrl || undefined,
        productData: data.productData || undefined
      };

      // Save message to database
      const message = await this.chatService.sendMessage(messageData);
      console.log('💾 Message saved to database:', message.id);

      // Get conversation participants
      const participantsResult = await this.chatService.getConversationParticipants(conversationId);
      const participants = participantsResult.participants; // Extract the participants array

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

      if (callback) {
        callback({
          success: true,
          data: messageResponse,
          message: 'Message sent successfully'
        });
      }

      // Emit to all participants in the conversation
      this.io.to(`conversation:${conversationId}`).emit('new_message', messageResponse);
      console.log(`📨 Message emitted to conversation ${conversationId}, participants:`,
        participants.map((p: any) => p.email));

      // Send notifications to other participants
      participants.forEach((participant: any) => {
        if (participant.id !== senderId) {
          const participantSocketId = this.userSockets.get(participant.id);
          if (!participantSocketId) {
            this.sendPushNotification(participant.id, {
              title: `${socket.user!.firstName} ${socket.user!.lastName}`.trim() || socket.user!.email,
              body: content?.substring(0, 100) || 'Sent a file',
              conversationId,
              messageId: message.id
            });
          }

          // Emit new message notification
          this.io.to(participant.id).emit('new_message_notification', {
            conversationId,
            messageId: message.id,
            senderName: `${socket.user!.firstName || ''} ${socket.user!.lastName || ''}`.trim() || socket.user!.email,
            preview: content.substring(0, 100) || 'Sent a file',
            unreadCount: 1
          });
        }
      });

    } catch (error: any) {
      console.error('Send message error:', error);

      if (callback) {
        callback({
          success: false,
          error: error.message || 'Failed to send message',
          tempId: data.tempId
        });
      }

      socket.emit('message_error', {
        error: error.message || 'Failed to send message',
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
      userName: `${socket.user!.firstName} ${socket.user!.lastName}`.trim() || socket.user!.email
    });
  }

  private handleTypingStop(socket: AuthenticatedSocket, data: any) {
    const { conversationId } = data;
    const userId = socket.user!.id;

    if (!conversationId) return;

    socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
      conversationId,
      userId
    });
  }

  private async handleMarkAsRead(socket: AuthenticatedSocket, data: any) {
    try {
      let conversationId: string;

      // Handle both string and object formats
      if (typeof data === 'string') {
        conversationId = data;
      } else if (typeof data === 'object' && data.conversationId) {
        conversationId = data.conversationId;
      } else {
        throw new Error('Conversation ID is required');
      }

      const userId = socket.user!.id;

      if (!conversationId) {
        throw new Error('Conversation ID is required');
      }

      console.log(`Marking messages as read in conversation ${conversationId} for user ${userId}`);

      const result = await this.chatService.markMessagesAsRead(conversationId, userId);
      const updatedMessages = result.unreadMessages; // Extract the unreadMessages array

      // Notify other participants that messages were read
      socket.to(`conversation:${conversationId}`).emit('messages_read', {
        conversationId,
        readerId: userId,
        messageIds: updatedMessages.map((m: any) => m.id)
      });

      console.log(`✅ Marked ${updatedMessages.length} messages as read`);

    } catch (error) {
      console.error('❌ Mark as read error:', error);
      socket.emit('read_error', { error: 'Failed to mark messages as read' });
    }
  }

  private async sendPushNotification(userId: string, notification: any) {
    // Implement notification service
    console.log('Sending push notification to user:', userId, notification);
  }

  // Utility method to get connected users count
  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  // Utility method to check if user is connected
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }

  getIO(): SocketIOServer {
    return this.io;
  }
}