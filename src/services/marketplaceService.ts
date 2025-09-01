import { apiClient, ApiResponse } from './api';

// Marketplace Data Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerImage?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'sold' | 'inactive';
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  location: string;
  images: File[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    image?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
  productId?: string;
  productTitle?: string;
  createdAt: string;
  updatedAt: string;
}

// Marketplace Service
export class MarketplaceService {
  // Product Management
  async getProducts(params?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiClient.get(`/products?${queryParams.toString()}`);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiClient.get(`/products/${id}`);
  }

  async createProduct(productData: CreateProductData): Promise<ApiResponse<Product>> {
    // Handle file uploads separately
    const formData = new FormData();
    formData.append('title', productData.title);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    formData.append('currency', productData.currency);
    formData.append('category', productData.category);
    formData.append('location', productData.location);
    
    productData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    return apiClient.uploadFile('/products', formData as any);
  }

  async updateProduct(id: string, productData: Partial<CreateProductData>): Promise<ApiResponse<Product>> {
    return apiClient.put(`/products/${id}`, productData);
  }

  async deleteProduct(id: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/products/${id}`);
  }

  async getUserProducts(userId?: string): Promise<ApiResponse<Product[]>> {
    const endpoint = userId ? `/products/user/${userId}` : '/products/my-products';
    return apiClient.get(endpoint);
  }

  // Messaging
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return apiClient.get('/messages/conversations');
  }

  async getConversation(conversationId: string): Promise<ApiResponse<{
    conversation: Conversation;
    messages: Message[];
  }>> {
    return apiClient.get(`/messages/conversations/${conversationId}`);
  }

  async sendMessage(data: {
    conversationId?: string;
    receiverId?: string;
    productId?: string;
    content: string;
    messageType?: 'text' | 'image' | 'file';
  }): Promise<ApiResponse<Message>> {
    return apiClient.post('/messages/send', data);
  }

  async markMessageAsRead(messageId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`/messages/${messageId}/read`);
  }

  async markConversationAsRead(conversationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`/messages/conversations/${conversationId}/read`);
  }

  // Bookmarks/Favorites
  async getBookmarks(): Promise<ApiResponse<Product[]>> {
    return apiClient.get('/bookmarks');
  }

  async addBookmark(productId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/bookmarks', { productId });
  }

  async removeBookmark(productId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/bookmarks/${productId}`);
  }

  // Search and Filters
  async searchProducts(query: string, filters?: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ApiResponse<{
    products: Product[];
    total: number;
    suggestions?: string[];
  }>> {
    return apiClient.post('/products/search', { query, filters });
  }

  async getCategories(): Promise<ApiResponse<{
    id: string;
    name: string;
    icon?: string;
    productCount: number;
  }[]>> {
    return apiClient.get('/categories');
  }

  async getLocations(): Promise<ApiResponse<{
    id: string;
    name: string;
    country: string;
    productCount: number;
  }[]>> {
    return apiClient.get('/locations');
  }

  // Request & Bring Feature
  async createRequest(data: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget?: number;
    urgency: 'low' | 'medium' | 'high';
  }): Promise<ApiResponse<{ id: string; message: string }>> {
    return apiClient.post('/requests', data);
  }

  async getRequests(params?: {
    category?: string;
    location?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{
    requests: any[];
    total: number;
    page: number;
    totalPages: number;
  }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return apiClient.get(`/requests?${queryParams.toString()}`);
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<{
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    data?: any;
    createdAt: string;
  }[]>> {
    return apiClient.get('/notifications');
  }

  async markNotificationAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put('/notifications/read-all');
  }
}

export const marketplaceService = new MarketplaceService();
