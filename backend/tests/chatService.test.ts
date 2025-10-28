// tests/chatService.test.ts
import { ChatService } from '../services/chatService';
import { PrismaClient } from '@prisma/client';
import { S3Client } from '@aws-sdk/client-s3';

jest.mock('@prisma/client');
jest.mock('@aws-sdk/client-s3');

describe('ChatService', () => {
  let chatService: ChatService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    chatService = new ChatService();
  });

  describe('createConversationByEmail', () => {
    it('should create a new conversation with safety disclaimer', async () => {
      const mockData = {
        creatorId: 'user1',
        participantEmail: 'seller@example.com',
        productId: 'product1',
        initialMessage: 'Hello, I want to buy this'
      };

      // Mock user lookup
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user2',
        email: 'seller@example.com',
        isActive: true,
        emailVerified: true
      } as any);

      // Mock transaction
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        return await callback(mockPrisma);
      });

      const result = await chatService.createConversationByEmail(mockData);

      expect(result).toBeDefined();
      expect(mockPrisma.conversation.create).toHaveBeenCalled();
    });

    it('should throw error for non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        chatService.createConversationByEmail({
          creatorId: 'user1',
          participantEmail: 'nonexistent@example.com'
        })
      ).rejects.toThrow('User not found with this email');
    });
  });

  describe('generatePresignedUrl', () => {
    it('should generate presigned URL for valid file type', async () => {
      const result = await chatService.generatePresignedUrl(
        'image.jpg',
        'image/jpeg',
        'user1'
      );

      expect(result).toHaveProperty('presignedUrl');
      expect(result).toHaveProperty('key');
      expect(result).toHaveProperty('url');
    });

    it('should reject invalid file types', async () => {
      await expect(
        chatService.generatePresignedUrl(
          'script.exe',
          'application/x-msdownload',
          'user1'
        )
      ).rejects.toThrow('File type not allowed');
    });
  });
});