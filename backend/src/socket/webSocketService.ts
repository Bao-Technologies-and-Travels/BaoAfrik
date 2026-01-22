import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from '../services/chatService';
import { notificationService } from '../services/notificationService';
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

  private setupMessageHandlers(socket: AuthenticatedSocket) {
    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        const { conversationId, content, senderId, receiverId } = data;

        // Save message to database
        const message = await this.chatService.createMessage({
          conversationId,
          senderId,
          content,
          messageType: 'TEXT'
        });
        // Emit to sender (confirmation)
        socket.emit('message_status', {
          messageId: message.id,
          status: 'delivered'
        });
        // Emit to receiver if online
        const receiverSocketId = this.userSockets.get(receiverId);
        if (receiverSocketId) {
          this.io.to(receiverSocketId).emit('receive_message', message);

          // Mark as delivered
          this.io.to(receiverSocketId).emit('message_status', {
            messageId: message.id,
            status: 'delivered'
          });
        }
      } catch (error) {
        console.error('Error handling send_message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    // Handle typing indicators
    socket.on('typing', (data) => {
      const { conversationId, userId, isTyping } = data;
      const userSocket = this.connectedUsers.get(userId);

      if (userSocket) {
        socket.broadcast.to(conversationId).emit('user_typing', {
          userId,
          isTyping,
          conversationId
        });
      }
    });
    // Handle message read receipts
    socket.on('mark_as_read', async (data) => {
      try {
        const { messageIds, conversationId, userId } = data;

        // Update in database
        await this.chatService.markMessagesAsRead({
          messageIds,
          conversationId,
          userId
        });
        // Notify other participants
        socket.broadcast.to(conversationId).emit('messages_read', {
          messageIds,
          conversationId,
          userId
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });
  }

  private handleIncomingMessage(socket: AuthenticatedSocket, data: any) {
    if (!socket.user) return;
    const { conversationId, content, receiverId } = data;

    // Save message to database
    this.chatService.createMessage({
      conversationId,
      senderId: socket.user.id,
      content,
      messageType: 'TEXT'
    }).then(savedMessage => {
      // Emit to sender
      socket.emit('message_sent', {
        ...savedMessage,
        status: 'delivered'
      });
      // Emit to receiver
      const receiverSocketId = this.userSockets.get(receiverId);
      if (receiverSocketId) {
        this.io.to(receiverSocketId).emit('new_message', {
          ...savedMessage,
          status: 'delivered'
        });
      }
    }).catch(error => {
      console.error('Error saving message:', error);
      socket.emit('message_error', {
        messageId: data.messageId,
        error: 'Failed to send message'
      });
    });
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
        return;
      }

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

            // notify ALL participants about status update
            if (updatedMessage) {
              const senderId = updatedMessage.senderId;
              // 1. Notify sender
              const senderSocketId = this.userSockets.get(senderId);
              if (senderSocketId) {
                this.io.to(senderSocketId).emit('message_status_updated', {
                  messageId,
                  status,
                  updatedAt: new Date()
                });
              }
              // 2. Notify all participants (in convo room)
              if (updatedMessage.conversationId) {
                this.io.to(`conversation:${updatedMessage.conversationId}`).emit('message_status_updated', {
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

      socket.on('leave_conversation', (conversationId) => {
        if (conversationId) {
          socket.leave(`conversation:${conversationId}`);
        }
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

      socket.on('add_reaction', async (data) => {
        await this.handleAddReaction(authenticatedSocket, data);
      });

      socket.on('remove_reaction', async (data) => {
        await this.handleRemoveReaction(authenticatedSocket, data);
      });

      socket.on('update_message_metadata', async (data) => {
        await this.handleUpdateMessageMetadata(authenticatedSocket, data);
      });

      socket.on('update_conversation_metadata', async (data) => {
        await this.handleUpdateConversationMetadata(authenticatedSocket, data);
      });

      socket.on('delete_conversation', async (data) => {
        await this.handleDeleteConversation(authenticatedSocket, data);
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
      const { conversationId, content, messageType, fileUrl, fileName, fileSize, files, replyToId, tempId } = data;
      const senderId = socket.user!.id;

      // Validate required fields - allow sending if there are files even without content
      const hasFiles = files && Array.isArray(files) && files.length > 0;
      const hasFileUrl = !!fileUrl;
      const hasContent = !!content && content.trim().length > 0;

      if (!conversationId || (!hasContent && !hasFileUrl && !hasFiles)) {
        throw new Error('Missing required message fields');
      }

      // Get conversation with participants
      const conversation = await this.chatService.getConversationById(conversationId);
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      // Handle files array - use first file for main fields, store all files for response
      let finalFileUrl = fileUrl;
      let finalFileName = fileName;
      let finalFileSize = fileSize;
      let allFiles: any[] = [];

      if (hasFiles) {
        // Use first file for main database fields
        const firstFile = files[0];
        finalFileUrl = firstFile.fileUrl || firstFile.url;
        finalFileName = firstFile.fileName || firstFile.name;
        finalFileSize = firstFile.fileSize || firstFile.size;
        allFiles = files;
      } else if (hasFileUrl) {
        // Single file in main fields
        allFiles = [{
          fileUrl: finalFileUrl,
          fileName: finalFileName,
          fileSize: finalFileSize,
          fileType: data.fileType || 'application/octet-stream'
        }];
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

      // Determine message type: VOICE if messageType is VOICE, FILE if has files, otherwise use provided messageType or TEXT
      let finalMessageType = messageType || 'TEXT';
      if (messageType === 'VOICE') {
        finalMessageType = 'VOICE';
      } else if (hasFiles) {
        finalMessageType = 'FILE';
      }


      // Always store voice properties in productData for VOICE messages
      if (finalMessageType === 'VOICE') {
        console.log('[VOICE] Processing voice message:', {
          hasVoiceDuration: !!data.voiceDuration,
          hasWaveformData: !!data.waveformData,
          waveformLength: data.waveformData?.length || 0,
          existingProductData: !!normalizedProductData
        });

        if (!normalizedProductData) {
          normalizedProductData = {};
        }
        if (data.voiceDuration) {
          normalizedProductData._voiceDuration = data.voiceDuration;
        }
        if (data.waveformData && Array.isArray(data.waveformData)) {
          normalizedProductData._waveformData = data.waveformData;
          console.log('[VOICE] Stored waveformData in normalizedProductData, length:', data.waveformData.length);
        }

        console.log('[VOICE] normalizedProductData after processing:', {
          hasVoiceDuration: !!normalizedProductData._voiceDuration,
          hasWaveformData: !!normalizedProductData._waveformData,
          waveformLength: normalizedProductData._waveformData?.length || 0
        });
      }

      if (allFiles.length > 1 && normalizedProductData) {
        normalizedProductData._files = allFiles;
      } else if (allFiles.length > 1) {
        normalizedProductData = { _files: allFiles };
      }

      // For voice messages, also set audioUrl
      const audioUrl = finalMessageType === 'VOICE' ? finalFileUrl : undefined;

      const message = await this.chatService.sendMessage({
        content: content || '', // Allow empty content if files are present
        conversationId,
        senderId,
        messageType: finalMessageType,
        fileUrl: finalFileUrl,
        fileName: finalFileName,
        fileSize: finalFileSize,
        audioUrl: audioUrl,
        replyToId,
        productData: normalizedProductData
      });

      // Parse productData to extract files if stored there
      // Note: message.productData from sendMessage is already parsed, but check if it's a string from Prisma
      let parsedProductData = null;
      let extractedFiles: any[] = [];
      if (message.productData) {
        // message.productData from sendMessage should already be parsed, but handle both cases
        if (typeof message.productData === 'string') {
          try {
            parsedProductData = JSON.parse(message.productData);
          } catch (e) {
            console.warn('Failed to parse productData string:', e);
            parsedProductData = null;
          }
        } else {
          parsedProductData = message.productData;
        }

        // Extract files from productData if stored there
        if (parsedProductData && parsedProductData._files && Array.isArray(parsedProductData._files)) {
          extractedFiles = parsedProductData._files;
          // Remove _files from productData to keep it clean
          delete parsedProductData._files;
          if (Object.keys(parsedProductData).length === 0) {
            parsedProductData = null;
          }
        }
      }

      // Prepare the message response with all files
      const messageResponse: any = {
        ...message,
        tempId,
        status: 'DELIVERED',
        files: extractedFiles.length > 0 ? extractedFiles : (allFiles.length > 0 ? allFiles : undefined),
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
        productData: parsedProductData
      };

      // Include voice message properties if this is a voice message
      if (finalMessageType === 'VOICE' && data.voiceDuration) {
        messageResponse.type = 'voice';
        messageResponse.messageType = 'VOICE';
        messageResponse.duration = data.voiceDuration;
        messageResponse.voiceDuration = data.voiceDuration;
        messageResponse.waveformData = data.waveformData || [];
        // Set audioUrl from files if available
        if (allFiles.length > 0 && allFiles[0].fileUrl) {
          messageResponse.audioUrl = allFiles[0].fileUrl;
        }
      }

      // Find all participants except sender
      const participants = (conversation.participants || []).map((p: any) => p.user).filter(Boolean);
      const recipientIds = participants.map((u: any) => u.id).filter((id: string) => id && id !== senderId);

      // Broadcast message to all in the conversation room except sender
      socket.to(`conversation:${conversationId}`).emit('receive_message', { ...messageResponse, isIncoming: true });

      // Notify sender of delivered status
      socket.emit('message_status_updated', {
        messageId: message.id,
        conversationId: conversationId,
        status: 'DELIVERED',
        updatedAt: new Date()
      });

      // Also deliver directly to each recipient socket (in case they haven't joined the room yet)
      for (const recipientId of recipientIds) {
        const recipientSocketId = this.userSockets.get(recipientId);
        if (recipientSocketId) {
          this.io.to(recipientSocketId).emit('receive_message', { ...messageResponse, isIncoming: true });
          // Deliver status to recipient
          this.io.to(recipientSocketId).emit('message_status_updated', {
            messageId: message.id,
            conversationId: conversationId,
            status: 'DELIVERED',
            updatedAt: new Date()
          });
        }
      }

      // Also send notifications and counts to each recipient's personal room
      for (const recipientId of recipientIds) {
        try {
          const senderName = `${socket.user?.firstName || ''} ${socket.user?.lastName || ''}`.trim() || socket.user?.email || 'Someone';
          const preview = finalMessageType === 'VOICE' || finalMessageType === 'AUDIO'
            ? 'Sent you a voice message'
            : (content || '').toString().slice(0, 120) || 'Sent you a message';

          // Create persistent notification in database
          await notificationService.createNotification({
            userId: recipientId,
            actorId: senderId,
            type: 'message',
            message: preview,
            metadata: {
              conversationId,
              messageId: message.id,
              senderName,
              senderId,
              senderImage: socket.user?.profileImage || null,
              messageType: finalMessageType
            }
          });

          // Emit real-time notification
          this.io.to(recipientId).emit('new_message_notification', {
            conversationId,
            messageId: message.id,
            preview,
            senderName,
            senderId,
            senderImage: socket.user?.profileImage || null
          });

          // Get updated unread counts (both chat and notifications)
          const chatCounts = await this.chatService.getUnreadCounts(recipientId);
          const totalChatUnread = (chatCounts || []).reduce((s: number, c: any) => s + (c.unreadCount || 0), 0);
          const notificationUnread = await notificationService.getUnreadCount(recipientId);

          this.io.to(recipientId).emit('notification_count', {
            totalUnread: totalChatUnread,
            notificationCount: notificationUnread
          });
        } catch (e) {
          console.warn('Failed to emit message notification/count', e);
        }
      }

      // Emit to sender: message_sent
      socket.emit('message_sent', { ...messageResponse, isIncoming: false, status: 'SENT' });

      // Also emit status update to sender immediately after sending
      socket.emit('message_status_updated', {
        messageId: message.id,
        conversationId: conversationId,
        status: 'SENT',
        updatedAt: new Date()
      });

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

    if (!conversationId) {
      return;
    }

    const typingData = {
      conversationId,
      userId,
      userName: `${socket.user!.firstName} ${socket.user!.lastName}`.trim() || socket.user!.email
    };

    // Emit to the conversation room (excluding the sender) - this is immediate
    socket.to(`conversation:${conversationId}`).emit('user_typing', typingData);

    // Also broadcast to all sockets in the user's personal room (for reliability)
    // This handles cases where user might not have joined the conversation room yet
    this.broadcastTypingToParticipants(conversationId, userId, 'user_typing', typingData);
  }

  private handleTypingStop(socket: AuthenticatedSocket, data: any) {
    const { conversationId } = data;
    const userId = socket.user!.id;

    if (!conversationId) {
      return;
    }

    const typingData = {
      conversationId,
      userId
    };

    // Emit to the conversation room (excluding the sender) - this is immediate
    socket.to(`conversation:${conversationId}`).emit('user_stop_typing', typingData);

    // Also broadcast to participants' personal rooms
    this.broadcastTypingToParticipants(conversationId, userId, 'user_stop_typing', typingData);
  }

  // Non-blocking background broadcast to participant personal rooms
  private broadcastTypingToParticipants(conversationId: string, senderId: string, event: string, data: any) {
    // Fire and forget - don't await
    prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          select: { userId: true }
        }
      }
    }).then(conversation => {
      if (conversation?.participants) {
        for (const participant of conversation.participants) {
          if (participant.userId !== senderId) {
            this.io.to(participant.userId).emit(event, data);
          }
        }
      }
    }).catch(() => {
      // Silently ignore errors - the conversation room broadcast already went out
    });
  }

  private async handleMarkAsRead(socket: AuthenticatedSocket, data: any) {
    try {
      const { messageIds, conversationId } = data;
      const userId = socket.user?.id;

      if (!userId) return;
      await this.chatService.markMessagesAsRead({
        messageIds,
        conversationId,
        userId
      });

      // Broadcast to all participants in the conversation room
      this.io.to(`conversation:${conversationId}`).emit('messages_read', {
        messageIds,
        conversationId,
        readBy: userId
      });

      // Also send status updates for each message to mark as read
      for (const messageId of messageIds) {
        this.io.to(`conversation:${conversationId}`).emit('message_status_updated', {
          messageId,
          conversationId,
          status: 'READ',
          updatedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
      socket.emit('error', { message: 'Failed to mark messages as read' });
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

  // Broadcast product notification to all connected users (DEPRECATED - only notify creator now)
  broadcastProductNotification(data: {
    productId: string;
    productTitle: string;
    sellerId: string;
    sellerName: string;
    sellerImage: string | null;
    productImage?: string | null;
  }) {
    try {
      // Broadcast to all connected users
      this.io.emit('new_product_notification', {
        productId: data.productId,
        productTitle: data.productTitle,
        sellerId: data.sellerId,
        sellerName: data.sellerName,
        sellerImage: data.sellerImage,
        productImage: data.productImage,
        timestamp: new Date().toISOString()
      });

      // Also update notification counts for all connected users
      this.io.emit('notification_count_updated');
    } catch (error) {
      console.error('Error broadcasting product notification:', error);
    }
  }

  // Send product notification only to the product creator
  sendProductNotificationToUser(userId: string, data: {
    productId: string;
    productTitle: string;
    sellerId: string;
    sellerName: string;
    sellerImage: string | null;
    productImage?: string | null;
  }) {
    try {
      // Send only to the specific user (product creator)
      this.io.to(userId).emit('product_creator_notification', {
        productId: data.productId,
        productTitle: data.productTitle,
        sellerId: data.sellerId,
        sellerName: data.sellerName,
        sellerImage: data.sellerImage,
        productImage: data.productImage,
        timestamp: new Date().toISOString()
      });

      // Update notification count for this user
      this.io.to(userId).emit('notification_count_updated');
    } catch (error) {
      console.error('Error sending product notification to user:', error);
    }
  }

  // Send status change notification to product creator
  sendStatusChangeNotification(userId: string, data: {
    productId: string;
    productTitle: string;
    previousStatus: string;
    newStatus: string;
  }) {
    try {
      // Send status change notification to the product creator
      this.io.to(userId).emit('product_status_change', {
        productId: data.productId,
        productTitle: data.productTitle,
        previousStatus: data.previousStatus,
        newStatus: data.newStatus,
        timestamp: new Date().toISOString()
      });

      // Update notification count for this user
      this.io.to(userId).emit('notification_count_updated');
    } catch (error) {
      console.error('Error sending status change notification:', error);
    }
  }

  private async handleAddReaction(socket: AuthenticatedSocket, data: any) {
    try {
      const { messageId, reaction } = data;
      const userId = socket.user!.id;

      if (!messageId || !reaction) {
        socket.emit('reaction_error', { error: 'Message ID and reaction are required' });
        return;
      }

      const result = await this.chatService.addReaction(messageId, userId, reaction);

      // Get conversation ID and participants from message
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: {
          conversationId: true,
          conversation: {
            include: {
              participants: {
                select: { userId: true }
              }
            }
          }
        }
      });

      if (message?.conversationId) {
        const reactionData = {
          messageId,
          conversationId: message.conversationId,
          userId: result.user.id,
          reaction: result.reaction,
          user: {
            id: result.user.id,
            firstName: result.user.firstName,
            lastName: result.user.lastName,
            profileImage: result.user.profileImage
          },
          allReactions: result.message.reactions
        };

        // Broadcast reaction to the conversation room
        this.io.to(`conversation:${message.conversationId}`).emit('reaction_added', reactionData);

        // Also broadcast to each participant's personal room to ensure they receive it
        // And send notifications like messages
        if (message.conversation?.participants) {
          for (const participant of message.conversation.participants) {
            if (participant.userId !== userId) {
              this.io.to(participant.userId).emit('reaction_added', reactionData);

              // Create notification for reaction (like message notifications)
              try {
                const senderName = `${socket.user?.firstName || ''} ${socket.user?.lastName || ''}`.trim() || socket.user?.email || 'Someone';
                const preview = `${senderName} reacted to a message`;

                // Create persistent notification in database
                await notificationService.createNotification({
                  userId: participant.userId,
                  actorId: userId,
                  type: 'message',
                  message: preview,
                  metadata: {
                    conversationId: message.conversationId,
                    messageId: messageId,
                    senderName,
                    senderId: userId,
                    senderImage: socket.user?.profileImage || null,
                    messageType: 'REACTION',
                    reaction: result.reaction
                  }
                });

                // Emit real-time notification
                this.io.to(participant.userId).emit('new_message_notification', {
                  conversationId: message.conversationId,
                  messageId: messageId,
                  preview,
                  senderName,
                  senderId: userId,
                  senderImage: socket.user?.profileImage || null,
                  type: 'reaction',
                  reaction: result.reaction
                });

                // Get updated unread counts
                const notificationUnread = await notificationService.getUnreadCount(participant.userId);
                this.io.to(participant.userId).emit('notification_count', {
                  notificationCount: notificationUnread
                });
              } catch (e) {
                console.warn('Failed to emit reaction notification', e);
              }
            }
          }
        }
      }

      socket.emit('reaction_added_success', { messageId, reaction: result.reaction });
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      socket.emit('reaction_error', { error: error.message || 'Failed to add reaction' });
    }
  }

  private async handleRemoveReaction(socket: AuthenticatedSocket, data: any) {
    try {
      const { messageId, reaction } = data;
      const userId = socket.user!.id;

      if (!messageId) {
        socket.emit('reaction_error', { error: 'Message ID is required' });
        return;
      }

      await this.chatService.removeReaction(messageId, userId);

      // Get conversation ID and participants from message
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: {
          conversationId: true,
          conversation: {
            include: {
              participants: {
                select: { userId: true }
              }
            }
          }
        }
      });

      if (message?.conversationId) {
        const removalData = {
          messageId,
          conversationId: message.conversationId,
          userId,
          reaction // Include the reaction that was removed
        };

        // Broadcast reaction removal to the conversation room
        this.io.to(`conversation:${message.conversationId}`).emit('reaction_removed', removalData);

        // Also broadcast to each participant's personal room
        if (message.conversation?.participants) {
          for (const participant of message.conversation.participants) {
            if (participant.userId !== userId) {
              this.io.to(participant.userId).emit('reaction_removed', removalData);
            }
          }
        }
      }

      socket.emit('reaction_removed_success', { messageId });
    } catch (error: any) {
      console.error('Error removing reaction:', error);
      socket.emit('reaction_error', { error: error.message || 'Failed to remove reaction' });
    }
  }

  private async handleUpdateMessageMetadata(socket: AuthenticatedSocket, data: any) {
    try {
      const { messageId, isPinned, isArchived, isImportant, isDeletedForMe, label } = data;
      const userId = socket.user!.id;

      if (!messageId) {
        socket.emit('metadata_error', { error: 'Message ID is required' });
        return;
      }

      const metadata = await this.chatService.updateMessageMetadata(messageId, userId, {
        isPinned,
        isArchived,
        isImportant,
        isDeletedForMe,
        label
      });

      // Emit success with the updated metadata
      socket.emit('message_metadata_updated', {
        messageId,
        metadata,
        isDeletedForMe: metadata.isDeletedForMe
      });
    } catch (error: any) {
      console.error('Error updating message metadata:', error);
      socket.emit('metadata_error', { error: error.message || 'Failed to update message metadata' });
    }
  }

  private async handleUpdateConversationMetadata(socket: AuthenticatedSocket, data: any) {
    try {
      const { conversationId, isPinned, isArchived, isMuted, label } = data;
      const userId = socket.user!.id;

      if (!conversationId) {
        socket.emit('conversation_metadata_error', { error: 'Conversation ID is required' });
        return;
      }

      const metadata = await this.chatService.updateConversationMetadata(conversationId, userId, {
        isPinned,
        isArchived,
        isMuted,
        label
      });

      // Metadata updates are user-specific, only notify the user who made the change
      socket.emit('conversation_metadata_updated_success', { conversationId, metadata });
    } catch (error: any) {
      console.error('Error updating conversation metadata:', error);
      socket.emit('conversation_metadata_error', { error: error.message || 'Failed to update conversation metadata' });
    }
  }

  private async handleDeleteConversation(socket: AuthenticatedSocket, data: any) {
    try {
      const { conversationId } = data;
      const userId = socket.user!.id;

      if (!conversationId) {
        socket.emit('conversation_delete_error', { error: 'Conversation ID is required' });
        return;
      }

      // Get participants before deletion
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: {
            select: { userId: true }
          }
        }
      });

      if (!conversation) {
        socket.emit('conversation_delete_error', { error: 'Conversation not found' });
        return;
      }

      await this.chatService.deleteConversation(conversationId, userId);

      // Delete is user-specific, only notify the user who deleted it
      socket.emit('conversation_delete_success', { conversationId });
    } catch (error: any) {
      console.error('Error deleting conversation:', error);
      socket.emit('conversation_delete_error', { error: error.message || 'Failed to delete conversation' });
    }
  }
}