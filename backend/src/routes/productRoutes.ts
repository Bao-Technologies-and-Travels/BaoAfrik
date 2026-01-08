import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateCreateProduct, validateUpdateProduct } from '@/middleware/validationMiddleware';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getProducts);
router.post('/', authenticateToken, validateCreateProduct, productController.createProduct);
router.get('/my-products', authenticateToken, productController.getUserProducts);
router.get('/user/:userId', productController.getUserProductsPublic);
router.post('/search', productController.getProducts);

// Bookmark/Save routes - must come before /:id routes
router.get('/saved', authenticateToken, productController.getSavedProducts);
router.post('/:id/save', authenticateToken, productController.toggleSaveProduct);
router.get('/:id/saved', authenticateToken, productController.checkProductSaved);

// Product CRUD routes - parameterized routes must come last
router.get('/:id', productController.getProduct);
router.put('/:id', authenticateToken, validateUpdateProduct, productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);

// Reviews routes
router.get('/:id/reviews', productController.getProductReviews);
router.post('/:id/reviews', authenticateToken, productController.upsertProductReview);

// Status routes
router.patch('/:id/status', authenticateToken, productController.updateProductStatus);

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