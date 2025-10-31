import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();
const productController = new ProductController();

router.use(authenticateToken);

router.get('/:id', productController.getProductById);

export default router;