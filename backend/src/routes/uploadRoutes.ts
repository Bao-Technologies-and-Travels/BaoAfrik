import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateFileUpload } from '@/middleware/validationMiddleware';

const router = Router();
const uploadController = new UploadController();

router.post('/profile', authenticateToken, validateFileUpload, uploadController.getPresignedUrlForProfile);
router.post('/chat', authenticateToken, validateFileUpload, uploadController.getPresignedUrlForChat);
router.post('/product', authenticateToken, validateFileUpload, uploadController.getPresignedUrlForProduct);
router.post('/view-url', authenticateToken, uploadController.getViewUrl);
router.post('/delete-file', authenticateToken, uploadController.deleteFile);
router.post('/batch-upload-urls', authenticateToken, uploadController.getBatchPresignedUrls);

export default router;