import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET!;
const AWS_REGION = process.env.AWS_REGION!;

const S3_PREFIXES = {
  profile: process.env.S3_PROFILE_PREFIX || 'profile-images',
  chat: process.env.S3_ATTACHMENTS_PREFIX || 'chat-uploads',
  product: process.env.S3_PRODUCT_PREFIX || 'product-images'
};

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  viewUrl: string;
}

export class S3Service {
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

  // Generate presigned URL for upload
  async generatePresignedUrl(
    fileName: string,
    fileType: string,
    uploadType: 'product' | 'profile' | 'chat',
    userId: string,
    fileSize?: number
  ): Promise<PresignedUrlResponse> {
    try {

      this.validateFile(fileType, fileSize);

      const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'bin';

      const prefix = S3_PREFIXES[uploadType];
      const key = `${prefix}/${userId}/${uuidv4()}.${fileExtension}`;

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType,
        Metadata: {
          uploadedBy: userId,
          uploadType: uploadType,
          originalName: fileName,
          uploadedAt: new Date().toUTCString()
        }
      });

      const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      const viewUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      return {
        uploadUrl,
        key,
        viewUrl
      };
    } catch (error: any) {
      console.error(' Error generating presigned URL:', error);
      throw new Error(`Error generating upload URL: ${error.message}`);
    }
  }

  // Generate batch presigned URLs
  async generateBatchPresignedUrls(
    files: Array<{ fileName: string; fileType: string; fileSize?: number }>,
    uploadType: 'product' | 'profile' | 'chat',
    userId: string
  ): Promise<PresignedUrlResponse[]> {
    try {
      const promises = files.map(file =>
        this.generatePresignedUrl(file.fileName, file.fileType, uploadType, userId, file.fileSize)
      );

      return await Promise.all(promises);
    } catch (error: any) {
      console.error(' Error generating batch presigned URLs:', error);
      throw new Error(`Error generating batch upload URLs: ${error.message}`);
    }
  }

  // Generate view URL for private files
  async generateViewUrl(key: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });

      const viewUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return viewUrl;
    } catch (error: any) {
      console.error(' Error generating view URL:', error);
      throw new Error(`Error generating view URL: ${error.message}`);
    }
  }

  // Delete file from S3
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key
      });

      await s3Client.send(command);
    } catch (error: any) {
      console.error(' Error deleting file from S3:', error);
      throw new Error(`Error deleting file: ${error.message}`);
    }
  }
}

export const s3Service = new S3Service();