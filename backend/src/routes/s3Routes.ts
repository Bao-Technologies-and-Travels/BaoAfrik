import {Router } from 'express'
import { getPresignedUrl, deleteImage } from '@/controllers/s3Controller'
import {authenticateToken as authMiddleware} from '@/middleware/authMiddleware';

const router = Router();
router.post('/upload-url', authMiddleware, getPresignedUrl);
router.post('/delete-image', authMiddleware, deleteImage);

export default router;