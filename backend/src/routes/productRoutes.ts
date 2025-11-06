import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { body, param, query } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateCreateProduct, validateUpdateProduct } from '@/middleware/validationMiddleware';

const router = Router();
const productController = new ProductController();

// GET /api/products
router.get('/', productController.getProducts);

// POST /api/products
router.post('/', authenticateToken, validateCreateProduct, productController.createProduct);

// GET /api/products/my-products
router.get('/my-products', authenticateToken, productController.getUserProducts);

// GET /api/products/user/:userId
router.get('/user/:userId', 
  param('userId').isUUID().withMessage('Invalid user ID'),
  productController.getUserProductsPublic
);

// POST /api/products/search 
router.post('/search', productController.getProducts);

// GET /api/products/:id
router.get('/:id', 
  param('id').isUUID().withMessage('Invalid product ID'),
  productController.getProduct
);

// PUT /api/products/:id
router.put('/:id', authenticateToken, productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', authenticateToken, 
  param('id').isUUID().withMessage('Invalid product ID'),
  productController.deleteProduct
);

// Status routes
router.patch('/:id/status', authenticateToken,
  param('id').isUUID().withMessage('Invalid product ID'),
  body('status').isIn(['DRAFT', 'PUBLISHED', 'SOLD', 'EXPIRED', 'DELETED']).withMessage('Invalid status'),
  productController.updateProductStatus
);

// Image upload routes
router.post('/:id/images/upload-url', authenticateToken,
  [
    body('fileName').notEmpty().withMessage('File name is required'),
    body('fileType').notEmpty().withMessage('File type is required')
  ],
  productController.generateImageUploadUrl
);

router.post('/:id/images', authenticateToken, productController.addProductImages);

export default router;