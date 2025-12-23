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
    }
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      if (!socket.user) {
        console.log('Unauthenticated socket connected');
        return;
      }
      console.log(`User ${socket.user.id} connected`);

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

        socket.on('message_status_update', async (data: { messageId: string, status: 'SENT' | 'DELIVERED' | 'READ' }) => {
          try {
            if (!socket.user) {
              throw new Error('Not authenticated');
            }

            const { messageId, status } = data;

            // update the message status
            const updatedMessage = await this.chatService.updateMessageStatus(
              messageId,
              socket.user.id,
              status
            );

            // notify sender about status update
            if (updatedMessage) {
              const senderId = updatedMessage.senderId;
              const senderSocketId = this.userSockets.get(senderId);
              if (senderSocketId) {
                this.io.to(senderSocketId).emit('message_status_updated', {
                  messageId,
                  status,
                  updatedAt: new Date()
                });
              }
            }
          } catch (error) {
            socket.emit('error', { message: 'Failed to update message status' });
          }
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
      conversations.forEach(conversation => {
        socket.join(`conversation:${conversation.id}`);
      });
    } catch (error: any) {
      console.error('Error joining conversations for user', userId, ':', error);
      throw new Error(`Error joining conversations: ${error.message}`);
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

        socket.on('join_user_room', (userId: string) => {
          socket.join(`user_${userId}`);
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
      const { productId, initialMessage, sellerId, product } = data;
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
      // Ensure buyer joins the new conversation room
      socket.join(`conversation:${conversation.id}`);
      // Ask seller to join as well if they are connected
      if (sellerSocketId) {
        this.io.to(sellerSocketId).emit('join_conversation', conversation.id);
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

      if (sellerSocketId) {
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
          this.io.to(product.seller?.id || data.sellerId).emit('notification_count', { totalUnread });
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
      const { conversationId, content, messageType, fileUrl, fileName, fileSize, replyToId, tempId } = data;
      const senderId = socket.user!.id;

      // Validate required fields
      if (!conversationId || (!content && !fileUrl)) {
        throw new Error('Missing required message fields');
      }

      // Get conversation with participants
      const conversation = await this.chatService.getConversationById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Create message
      // Parse productData if present and serialize as JSON to backend
      let normalizedProductData = null;
      if (typeof data.productData === 'string') {
        try {
          normalizedProductData = JSON.parse(data.productData);
        } catch (_) {
          normalizedProductData = data.productData;
        }
      } else if (data.productData) {
        normalizedProductData = data.productData;
      }

      const message = await this.chatService.sendMessage({
        content,
        conversationId,
        senderId,
        messageType,
        fileUrl,
        fileName,
        fileSize,
        replyToId,
        productData: normalizedProductData
      });

      // Prepare the message response
      const messageResponse = {
        ...message,
        tempId,
        status: 'DELIVERED',
        replyTo: message.replyTo ? {
          id: message.replyTo.id,
          content: message.replyTo.content,
          sender: {
            id: message.replyTo.sender.id,
            firstName: message.replyTo.sender.firstName,
            lastName: message.replyTo.sender.lastName,
            profileImage: message.replyTo.sender.profileImage
          }
        } : null,
        productData: message.productData ? JSON.parse(message.productData) : null
      };

      // Find all participants except sender
      const participants = (conversation.participants || []).map((p: any) => p.user).filter(Boolean);
      const recipientIds = participants.map((u: any) => u.id).filter((id: string) => id && id !== senderId);

      // Emit to recipients: receive_message, notification, notification_count
      for (const recipientId of recipientIds) {
        this.io.to(recipientId).emit('receive_message', { ...messageResponse, isIncoming: true });
        try {
          const senderName = `${socket.user?.firstName || ''} ${socket.user?.lastName || ''}`.trim() || socket.user?.email || 'Someone';
          const preview = (content || '').toString().slice(0, 120);
          this.io.to(recipientId).emit('new_message_notification', {
            conversationId,
            messageId: message.id,
            preview,
            senderName,
            senderId,
            senderImage: socket.user?.profileImage || null
          });
          const counts = await this.chatService.getUnreadCounts(recipientId);
          const totalUnread = (counts || []).reduce((s: number, c: any) => s + (c.unreadCount || 0), 0);
          this.io.to(recipientId).emit('notification_count', { totalUnread });
        } catch (e) {
          console.warn('Failed to emit message notification/count', e);
        }
      }

      // Emit to sender: message_sent
      socket.emit('message_sent', { ...messageResponse, isIncoming: false, status: 'SENT' });

      if (callback) {
        callback({ success: true, message: messageResponse });
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (callback) {
        callback({
          success: false,
          error: error.message || 'Failed to send message'
        });
      }
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