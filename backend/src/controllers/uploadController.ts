import { Request, Response } from 'express';
// import { s3Service } from '@/services/s3Service';
import { gcpStorageService } from '../services/gcpStorageService';
import { validationResult } from 'express-validator';

export class UploadController {
  // For profile images (matches your ProfileSetup.tsx usage)
  async getPresignedUrlForProfile(req: Request, res: Response) {
    try {
      const { fileName, fileType, userId } = req.body;
      const authenticatedUserId = (req as any).user.id;

      // Verify the user is uploading for themselves
      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to upload for this user'
        });
      }

      const presignedData = await gcpStorageService.generateSignedUrl(
        fileName,
        fileType,
        'profile',
        userId
      );

      return res.json({
        success: true,
        uploadUrl: presignedData.uploadUrl,
        fileUrl: presignedData.viewUrl,
        key: presignedData.key
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPresignedUrlForChat(req: Request, res: Response) {
    try {
      const { fileName, fileType, userId } = req.body;
      const authenticatedUserId = (req as any).user.id;

      // Verify the user is uploading for themselves
      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to upload for this user'
        });
      }

      const presignedData = await gcpStorageService.generateSignedUrl(
        fileName,
        fileType,
        'chat',
        userId
      );

      return res.json({
        success: true,
        uploadUrl: presignedData.uploadUrl,
        fileUrl: presignedData.viewUrl,
        key: presignedData.key
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // For product images
  async getPresignedUrlForProduct(req: Request, res: Response) {
    try {
      const { fileName, fileType, userId } = req.body;
      const authenticatedUserId = (req as any).user.id;

      if (!fileName || !fileType || !userId) {
        return res.status(400).json({
          success: false,
          message: 'FileName, fileType, and userId are required'
        });
      }

      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to upload for this user'
        });
      }

      const presignedData = await gcpStorageService.generateSignedUrl(
        fileName,
        fileType,
        'product',
        userId
      );

      return res.json({
        success: true,
        data: presignedData
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get view URL for private files
  async getViewUrl(req: Request, res: Response) {
    try {
      const { key } = req.body;

      if (!key) {
        return res.status(400).json({
          success: false,
          message: 'Key is required'
        });
      }

      const viewUrl = await gcpStorageService.generateViewUrl(key);

      return res.json({
        success: true,
        viewUrl
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete file
  async deleteFile(req: Request, res: Response) {
    try {
      const { key } = req.body;
      const userId = (req as any).user.id;

      if (!key) {
        return res.status(400).json({
          success: false,
          message: 'Key is required'
        });
      }

      await gcpStorageService.deleteFile(key);

      return res.json({
        success: true,
        message: 'File deleted successfully'
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Batch upload for multiple files
  async getBatchPresignedUrls(req: Request, res: Response) {
    try {
      const { files, uploadType, userId } = req.body;
      const authenticatedUserId = (req as any).user.id;

      if (userId !== authenticatedUserId) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to upload for this user'
        });
      }

      if (!files || !Array.isArray(files) || !uploadType) {
        return res.status(400).json({
          success: false,
          message: 'Files array and uploadType are required'
        });
      }

      const fileData = files.map((file: any) => ({
        fileName: file.fileName,
        fileType: file.fileType
      }));

      const presignedData = await gcpStorageService.generateBatchSignedUrls(
        fileData,
        uploadType,
        userId
      );

      const responseData = presignedData.map(data => ({
        uploadUrl: data.uploadUrl,
        fileUrl: data.viewUrl,
        key: data.key
      }));

      return res.json({
        success: true,
        data: responseData
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}