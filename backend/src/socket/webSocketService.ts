import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chatService';
import jwt from 'jsonwebtoken';
import prisma from '@/config/database';

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
        // Allow connection but without user data
        return next();
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        // return next(new Error('JWT secret not configured'));
        return next(new Error('Server configuration error'));
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
        // Allow connection but without user data
        return next();
      }

      socket.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new Error('Invalid token format'));
      } else if (error instanceof jwt.TokenExpiredError) {
        return next(new Error('Access token expired'));
      } else {
        return next(new Error('Websocket Authentication error:'));
      }

      // allow connection without user data, don't throw any error to prevent socket disconnection
      next();
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      const authenticatedSocket = socket as AuthenticatedSocket;

      if (!authenticatedSocket.user) {

        // Allow limited functionality for unauthenticated users
        socket.emit('connected', {
          authenticated: false,
          message: 'Connected as guest'
        });

        // Basic events that don't require authentication
        socket.on('ping', (cb) => {
          if (typeof cb === 'function') {
            cb('pong');
          }
        });

        socket.on('disconnect', (reason) => {
        });

        return;
      }

      const userId = authenticatedSocket.user.id;

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
        await this.handleSendMessage(authenticatedSocket, data, callback);
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

      socket.on('disconnect', (reason) => {
        this.userSockets.delete(userId);
        this.connectedUsers.delete(userId);
      });

      socket.on('error', (error) => {
        throw new Error(`Socket error for user ${userId}:`);
      });

      // Heartbeat to keep connection alive
      socket.on('ping', (cb) => {
        if (typeof cb === 'function') {
          cb('ping');
        }
      });
    });
  }

  private async joinUserConversations(socket: AuthenticatedSocket, userId: string) {
    try {
      const conversations = await this.chatService.getUserConversations(userId);

      conversations.forEach((conv: any) => {
        socket.join(`conversation:${conv.id}`);
      });

      socket.join(userId);
    } catch (error) {
      throw new Error('Error joining conversations');
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
        socket.emit('conversation_join_error', { error: 'Access denied' });
      }
    } catch (error) {
      socket.emit('conversation_join_error', { error: 'Failed to join conversation' });
    }
  }

  private async handleContactSeller(socket: AuthenticatedSocket, data: any) {
    try {
      const { productId, initialMessage, sellerId , product} = data;
      const buyerId = socket.user!.id;

      if (!sellerId || !productId) {
        throw new Error('Seller ID and Product ID are required');
      }

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
      }

      if(sellerSocketId) {
        try {
          const notifPayload = {
            type: 'NEW_CONVERSATION',
            title: 'New conversation started',
            boody: `${socket.user!.firstName} started a conversation about your product.`,
            conversationId: conversation.id,
            product: data.product
          };
          this.io.to(product.seller?.id || data.sellerId).emit('notification', notifPayload);

          const counts = await this.chatService.getUnreadCounts(product.seller.id || data.sellerId);
          const totalUnread = (counts || []).reduce((s: number, c: any) => s + (c.unreadCount || 0), 0);
          this.io.to(product.seller?.id || data.sellerId).emit('notification_count', { totalUnread});
        } catch (e) {
          console.warn('Failed to emit notification/count on contact_seller', e);
        }
      }

      socket.emit('conversation_created', { conversation });

    } catch (error: any) {
      socket.emit('contact_seller_error', { error: error.message || 'Failed to contact seller' });
    }
  }

  private async handleSendMessage(socket: AuthenticatedSocket, data: any, callback?: Function) {
    try {
      console.log('📨 Backend received message data:', {
        conversationId: data.conversationId,
        hasProductData: !!data.productData,
        productData: data.productData
      });

      const { conversationId, content, messageType, fileUrl, fileName, fileSize, replyTo, tempId } = data;
      const senderId = socket.user!.id;
      const senderEmail = socket.user!.email;

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

      console.log('💾 Message saved with productData:', message.productData);

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

      // emit to sender
      socket.emit('message_sent', messageResponse);

      // Emit to all participants in the conversation
      socket.to(`conversation:${conversationId}`).emit('new_message', messageResponse);

      // Send notifications to other participants
      participants.forEach(async (participant: any) => {
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

          try {
            const notifPayload = {
              type: 'NEW_MESSAGE',
              title: `${socket.user!.firstName} ${socket.user!.lastName}`.trim() || socket.user!.email,
              body: content?.substring(0, 100) || 'Sent a file',
              conversationId,
              messageId: message.id,
              timestamp: new Date().toISOString()
            };
            this.io.to(participant.id).emit('notification', notifPayload);

            try {
              const counts = await this.chatService.getUnreadCounts(participant.id);
              const totalUnread = (counts || []).reduce((s: number, c: any) => s + (c.unreadCount || 0), 0);
              this.io.to(participant.id).emit('notification_count', {totalUnread});
            } catch (e) {
              console.warn('Failed to compute unread counts for notification_count emit', e);
            }
          } catch (e) {
            console.warn('Failed to emit notification to participant', e);
          }
        }
      });

    } catch (error: any) {

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

      const result = await this.chatService.markMessagesAsRead(conversationId, userId);
      const updatedMessages = result.unreadMessages; // Extract the unreadMessages array

      // Notify other participants that messages were read
      socket.to(`conversation:${conversationId}`).emit('messages_read', {
        conversationId,
        readerId: userId,
        messageIds: updatedMessages.map((m: any) => m.id)
      });

    } catch (error) {
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