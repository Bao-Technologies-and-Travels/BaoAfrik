import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

const BUCKET_NAME = process.env.GCP_STORAGE_BUCKET!;

const STORAGE_PREFIXES = {
  profile: process.env.STORAGE_PROFILE_PREFIX || 'profile-images',
  chat: process.env.STORAGE_ATTACHMENTS_PREFIX || 'chat-uploads',
  product: process.env.STORAGE_PRODUCT_PREFIX || 'product-images'
};

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  viewUrl: string;
}

export class GCPStorageService {
  private validateFile(fileType: string, fileSize?: number): void {
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
      'audio/webm', 'audio/mpeg', 'audio/wav',
      'video/mp4', 'video/mpeg', 'video/quicktime',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(fileType.toLowerCase())) {
      throw new Error(`Invalid file type: ${fileType}. Allowed types: images, audio, video, PDF, Word documents.`);
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (fileSize && fileSize > maxSize) {
      throw new Error(`File too large: ${(fileSize / 1024 / 1024).toFixed(2)}MB. Maximum size is 50MB.`);
    }
  }
  async configureCors() {
    try {
      const origins =
        process.env.CORS_ORIGINS?.split(',').map(o => o.trim()).filter(Boolean) || [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://staging.baoafrik.com',
          'https://www.staging.baoafrik.com',
        ];

      await storage.bucket(BUCKET_NAME).setCorsConfiguration([
        {
          origin: origins,
          method: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
          responseHeader: ['Content-Type', 'Content-MD5', 'Content-Disposition'],
          maxAgeSeconds: 3600,
        },
      ]);
    } catch (error) {
      console.error('Error configuring CORS:', error);
      throw error;
    }
  }

  // Generate signed URL for upload
  async generateSignedUrl(
    fileName: string,
    fileType: string,
    uploadType: 'product' | 'profile' | 'chat',
    userId: string,
    fileSize?: number
  ): Promise<PresignedUrlResponse> {
    try {
      this.validateFile(fileType, fileSize);

      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'bin';
      const prefix = STORAGE_PREFIXES[uploadType];
      const key = `${prefix}/${userId}/${uuidv4()}.${fileExtension}`;

      const [uploadUrl] = await storage
        .bucket(BUCKET_NAME)
        .file(key)
        .getSignedUrl({
          version: 'v4',
          action: 'write',
          expires: Date.now() + 60 * 60 * 1000, // 1 hour
          contentType: fileType,
        });

      const viewUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${key}`;

      return {
        uploadUrl,
        key,
        viewUrl
      };
    } catch (error: any) {
      throw new Error(`Error generating upload URL: ${error.message}`);
    }
  }

  // Generate batch signed URLs
  async generateBatchSignedUrls(
    files: Array<{ fileName: string; fileType: string; fileSize?: number }>,
    uploadType: 'product' | 'profile' | 'chat',
    userId: string
  ): Promise<PresignedUrlResponse[]> {
    try {
      const promises = files.map(file =>
        this.generateSignedUrl(file.fileName, file.fileType, uploadType, userId, file.fileSize)
      );

      return await Promise.all(promises);
    } catch (error: any) {
      throw new Error(`Error generating batch upload URLs: ${error.message}`);
    }
  }

  // Generate view URL for private files
  async generateViewUrl(key: string): Promise<string> {
    try {
      const [viewUrl] = await storage
        .bucket(BUCKET_NAME)
        .file(key)
        .getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 60 * 60 * 1000, // 1 hour
        });

      return viewUrl;
    } catch (error: any) {
      throw new Error(`Error generating view URL: ${error.message}`);
    }
  }

  // Delete file from GCS
  async deleteFile(key: string): Promise<void> {
    try {
      await storage
        .bucket(BUCKET_NAME)
        .file(key)
        .delete();
    } catch (error: any) {
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}

export const gcpStorageService = new GCPStorageService();
