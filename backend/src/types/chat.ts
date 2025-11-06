export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  productId?: string;
  conversationId?: string;
  imageUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyToId?: string;
  productSnapshot?: any;
  subject?: string;
  content: string;
  isRead: boolean;
  messageType: MessageType;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  sender?: User;
  receiver?: User;
  product?: Product;
  conversation?: Conversation;
  replyTo?: Message;
  replies?: Message[];
  statuses?: MessageStatus[];
}

export interface Conversation {
  id: string;
  productId?: string;
  lastMessageId?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  product?: Product;
  lastMessage?: Message;
  participants: ConversationParticipant[];
  messages: Message[];
}

export interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  joinedAt: Date;
  lastReadAt: Date;
  
  // Relations
  conversation: Conversation;
  user: User;
}

export interface MessageStatus {
  id: string;
  messageId: string;
  userId: string;
  status: 'sent' | 'delivered' | 'read';
  updatedAt: Date;
  
  // Relations
  message: Message;
  user: User;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  rating?: number;
  isVerifiedSeller: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  images?: any;
  sellerId: string;
}

export type MessageType = 
  | 'INQUIRY' 
  | 'NEGOTIATION' 
  | 'ORDER' 
  | 'COMPLAINT' 
  | 'GENERAL' 
  | 'TEXT' 
  | 'IMAGE' 
  | 'VOICE' 
  | 'FILE';

export interface CreateMessageInput {
  content?: string;
  messageType: MessageType;
  receiverId: string;
  productId?: string;
  conversationId?: string;
  imageUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyToId?: string;
  productSnapshot?: any;
  subject?: string;
}

export interface CreateConversationInput {
  productId?: string;
  participantIds: string[]; 
}

export interface SocketMessageData {
  conversationId: string;
  content?: string;
  messageType: MessageType;
  replyToId?: string;
}