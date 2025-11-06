import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const uploadController = new UploadController();

// Validation rules
const fileUploadValidation = [
  body('fileName').notEmpty().withMessage('File name is required'),
  body('fileType').notEmpty().withMessage('File type is required'),
  body('userId').notEmpty().withMessage('User ID is required')
];

// Routes that match your frontend calls
router.post('/profile', authenticateToken, fileUploadValidation, uploadController.getPresignedUrlForProfile);
router.post('/chat', authenticateToken, fileUploadValidation, uploadController.getPresignedUrlForChat);
router.post('/product', authenticateToken, fileUploadValidation, uploadController.getPresignedUrlForProduct);
router.post('/view-url', authenticateToken, uploadController.getViewUrl);
router.post('/delete-file', authenticateToken, uploadController.deleteFile);
router.post('/batch-upload-urls', authenticateToken, uploadController.getBatchPresignedUrls);

export default router;