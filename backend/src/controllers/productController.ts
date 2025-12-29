import { Request, Response } from 'express';
import { ProductService, ProductImage } from '../services/productService';
import { gcpStorageService } from '../services/gcpStorageService';
import { validationResult } from 'express-validator';
import { notificationService } from '../services/notificationService';
import { webSocketService } from '../server';
import { Prisma } from '../generated/client';

// Type for product with seller relation
type ProductWithSeller = {
  id: string;
  title: string;
  images?: Prisma.JsonValue;
  seller?: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    profileImage: string | null;
  } | null;
};

const productService = new ProductService();

export class ProductController {
  // Create new product
  async createProduct(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const {
        title,
        description,
        price,
        currency = 'USD',
        quantity,
        category,
        origin,
        location,
        deliveryAvailable = false
      } = req.body;

      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const productData = {
        title,
        description,
        price: parseFloat(price),
        currency,
        quantity: parseInt(quantity),
        category,
        origin,
        location,
        deliveryAvailable: Boolean(deliveryAvailable),
        status: 'DRAFT' as const // Use const assertion
      };

      const product = await productService.createProduct(productData, userId);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all products
  async getProducts(req: Request, res: Response) {
    try {
      const {
        category,
        origin,
        minPrice,
        maxPrice,
        search,
        status,
        page = '1',
        limit = '10'
      } = req.query;

      // Handle both GET query params and POST body for search
      const searchQuery = req.body.search || search;

      const filters = {
        category: category as string,
        origin: origin as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        search: searchQuery as string,
        status: status as any
      };

      const result = await productService.getProducts(
        filters,
        parseInt(page as string),
        parseInt(limit as string)
      );

      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get single product
  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.json({
        success: true,
        data: product
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      const product = await productService.updateProduct(id, updateData, userId);

      return res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
      }

      await productService.deleteProduct(id, userId);

      return res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Generate presigned URL for image upload
  async generateImageUploadUrl(req: Request, res: Response) {
    try {
      const { fileName, fileType } = req.body;
      const userId = (req as any).user.id;

      if (!fileName || !fileType) {
        return res.status(400).json({
          success: false,
          message: 'FileName and fileType are required'
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

  // Add images to product
  async addProductImages(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { images } = req.body; // Array of { url, key, isPrimary, order }
      const userId = (req as any).user.id;

      if (!images || !Array.isArray(images)) {
        return res.status(400).json({
          success: false,
          message: 'Images array is required'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const product = await productService.addProductImages(id, userId, images);

      return res.json({
        success: true,
        message: 'Images added successfully',
        data: product
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Set primary image
  async setPrimaryImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { imageIndex } = req.body;
      const userId = (req as any).user.id;

      if (imageIndex === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Image index is required'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const product = await productService.setPrimaryImage(id, userId, parseInt(imageIndex));

      return res.json({
        success: true,
        message: 'Primary image set successfully',
        data: product
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Invalid image index') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Remove image
  async removeImage(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { imageIndex } = req.body;
      const userId = (req as any).user.id;

      if (imageIndex === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Image index is required'
        });
      }

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const product = await productService.removeProductImage(id, userId, parseInt(imageIndex));

      return res.json({
        success: true,
        message: 'Image removed successfully',
        data: product
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      if (error.message === 'Invalid image index') {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get user's products
  async getUserProducts(req: Request, res: Response) {
    try {
      const { status, page = '1', limit = '10' } = req.query;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const result = await productService.getUserProducts(
        userId,
        status as any,
        parseInt(page as string),
        parseInt(limit as string)
      );

      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Update product status
  async updateProductStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = (req as any).user?.id;

      if (!id || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and authentication required'
        });
      }

      const product: any = await productService.updateProductStatus(id, userId, status);

      // If product was newly published, create notifications and broadcast
      if (product._newlyPublished && status === 'PUBLISHED') {
        try {
          // Get product with seller info for notification
          const productWithSeller = await productService.getProductById(id) as ProductWithSeller | null;

          if (productWithSeller && productWithSeller.seller) {
            const seller = productWithSeller.seller;
            const sellerName = `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || 'A seller';

            // Get product image (primary image or first image)
            let productImage: string | null = null;
            if (productWithSeller.images) {
              // Parse images from JSON if needed
              let images: ProductImage[] = [];
              if (Array.isArray(productWithSeller.images)) {
                images = productWithSeller.images as unknown as ProductImage[];
              } else if (typeof productWithSeller.images === 'string') {
                images = JSON.parse(productWithSeller.images) as ProductImage[];
              } else {
                images = productWithSeller.images as unknown as ProductImage[];
              }

              if (Array.isArray(images) && images.length > 0) {
                const primaryImage = images.find((img: ProductImage) => img.isPrimary);
                productImage = primaryImage?.url || images[0]?.url || null;
              }
            }

            // Create notifications for all users
            await notificationService.createNotificationsForAllUsers({
              actorId: seller.id,
              type: 'product',
              message: `${sellerName} just listed "${productWithSeller.title}"`,
              metadata: {
                productId: productWithSeller.id,
                productTitle: productWithSeller.title,
                productImage: productImage,
                sellerId: seller.id,
                sellerName: sellerName,
                sellerImage: seller.profileImage
              }
            });

            // Broadcast via WebSocket
            webSocketService.broadcastProductNotification({
              productId: productWithSeller.id,
              productTitle: productWithSeller.title,
              sellerId: seller.id,
              sellerName: sellerName,
              sellerImage: seller.profileImage || null,
              productImage: productImage
            });
          }
        } catch (notifError: any) {
          // Log error but don't fail the request
          console.error('Error creating product notifications:', notifError);
        }
      }

      // Remove the internal flag before sending response
      const { _newlyPublished, ...productData } = product;

      return res.json({
        success: true,
        message: `Product ${status.toLowerCase()} successfully`,
        data: productData
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async saveAsDraft(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;

      if (!id || !userId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and authentication required'
        });
      }

      const product = await productService.updateProductStatus(id, userId, 'DRAFT');

      return res.json({
        success: true,
        message: 'Product saved as draft',
        data: product
      });
    } catch (error: any) {
      if (error.message === 'Product not found or unauthorized') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserProductsPublic(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const { status, page = '1', limit = '10' } = req.query;

      const result = await productService.getUserProducts(
        userId,
        status as any,
        parseInt(page as string),
        parseInt(limit as string)
      );

      return res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get reviews and rating summary for a product
  async getProductReviews(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      const summary = await productService.getProductReviews(id);

      return res.json({
        success: true,
        data: summary
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Create or update a review for the current user
  async upsertProductReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = (req as any).user?.id;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;

      if (!numericRating || Number.isNaN(numericRating)) {
        return res.status(400).json({
          success: false,
          message: 'Valid rating is required'
        });
      }

      const review = await productService.upsertProductReview(id, userId, numericRating, comment);
      const summary = await productService.getProductReviews(id);

      return res.status(201).json({
        success: true,
        message: 'Review saved successfully',
        data: {
          review,
          summary
        }
      });
    } catch (error: any) {
      if (error.message === 'Product not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}