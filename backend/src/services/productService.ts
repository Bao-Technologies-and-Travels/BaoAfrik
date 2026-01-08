import prisma from '../config/database';
import { Product, ProductStatus, Prisma, ProductReview } from '../generated/client';
import { s3Service } from './s3Service';
import { gcpStorageService } from './gcpStorageService';

export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    category: string;
    origin: string;
    location: string;
    deliveryAvailable: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED' | 'DELETED';
}

export interface UpdateProductData {
    title?: string;
    description?: string;
    price?: number;
    currency?: string;
    quantity?: number;
    category?: string;
    origin?: string;
    location?: string;
    deliveryAvailable?: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'SOLD' | 'EXPIRED' | 'DELETED';
}

export interface ProductImage {
    url: string;
    key: string;
    isPrimary: boolean;
    order: number;
}

interface ProductFilters {
    category?: string;
    origin?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    status?: ProductStatus;
}

function isProductImageArray(value: any): value is ProductImage[] {
    return Array.isArray(value) && value.every(item =>
        typeof item === 'object' &&
        item !== null &&
        'url' in item &&
        'key' in item &&
        'isPrimary' in item &&
        'order' in item
    );
}

function parseProductImages(images: Prisma.JsonValue | null): ProductImage[] {
    if (!images) return [];

    try {
        if (isProductImageArray(images)) {
            return images;
        }

        // If it's a string, try to parse it
        if (typeof images === 'string') {
            const parsed = JSON.parse(images);
            return isProductImageArray(parsed) ? parsed : [];
        }

        return [];
    } catch (error) {
        return [];
    }
}

function toPrismaJson(images: ProductImage[]): Prisma.JsonArray {
    return images as unknown as Prisma.JsonArray;
}

export interface ProductReviewInput {
    rating: number;
    comment?: string;
}

export class ProductService {
    // Create new product listing
    async createProduct(productData: CreateProductData, sellerId: string): Promise<Product> {
        try {
            if (!sellerId) {
                throw new Error('Seller ID is required');
            }

            const categoryMap: { [key: string]: string } = {
                'beauty': 'Beauty & Wellness',
                'books': 'Books & Media',
                'fashion': 'Fashion & Textiles',
                'food': 'Food & Spices',
                'home': 'Home & Decor'
            };

            const processedData = {
                ...productData,
                category: categoryMap[productData.category] || productData.category,
                sellerId
            };

            const product = await prisma.product.create({
                data: processedData,
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            rating: true
                        }
                    }
                }
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error creating product: ${error.message}`);
        }
    }

    // Get product by ID
    async getProductById(id: string): Promise<Product | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            rating: true,
                            totalSales: true,
                            isVerifiedSeller: true
                        }
                    },
                    likes: true,
                    saves: true
                }
            });

            if (product) {
                // Increment view count
                await prisma.product.update({
                    where: { id },
                    data: { viewCount: { increment: 1 } }
                });
            }

            return product;
        } catch (error: any) {
            throw new Error(`Error fetching product: ${error.message}`);
        }
    }

    // Get products with filtering and pagination
    async getProducts(filters: ProductFilters = {}, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const where: any = {
                status: filters.status || ProductStatus.PUBLISHED,
                isActive: true
            };

            // Apply filters
            if (filters.category) where.category = filters.category;
            if (filters.origin) where.origin = filters.origin;

            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                where.price = {};
                if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
                if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
            }

            if (filters.search) {
                where.OR = [
                    { title: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
            }

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        seller: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true,
                                rating: true,
                                isVerifiedSeller: true
                            }
                        },
                        likes: true,
                        saves: true
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.product.count({ where })
            ]);

            return {
                products,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            };
        } catch (error: any) {
            throw new Error(`Error fetching products: ${error.message}`);
        }
    }

    // Update product
    async updateProduct(id: string, updateData: UpdateProductData, sellerId: string): Promise<Product> {
        try {
            if (!id || !sellerId) {
                throw new Error('Product ID and Seller ID are required');
            }

            // Verify product belongs to user
            const existingProduct = await prisma.product.findFirst({
                where: { id, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const product = await prisma.product.update({
                where: { id },
                data: updateData,
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            rating: true
                        }
                    }
                }
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    // Delete product (soft delete)
    async deleteProduct(id: string, sellerId: string): Promise<void> {
        try {
            if (!id || !sellerId) {
                throw new Error('Product ID and Seller ID are required');
            }

            const existingProduct = await prisma.product.findFirst({
                where: { id, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            await prisma.product.update({
                where: { id },
                data: {
                    status: ProductStatus.DELETED,
                    isActive: false
                }
            });
        } catch (error: any) {
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }

    // Add images to product
    async addProductImages(productId: string, sellerId: string, images: ProductImage[]): Promise<Product> {
        try {
            if (!productId || !sellerId) {
                throw new Error('Product ID and seller ID are required');
            }

            const existingProduct = await prisma.product.findFirst({
                where: { id: productId, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const currentImages = parseProductImages(existingProduct.images);
            const updatedImages = [...currentImages, ...images];

            const product = await prisma.product.update({
                where: { id: productId },
                data: { images: updatedImages as any },
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error adding product images: ${error.message}`);
        }
    }

    // Set primary image
    async setPrimaryImage(productId: string, sellerId: string, imageIndex: number): Promise<Product> {
        try {
            if (!productId || !sellerId) {
                throw new Error('Product ID and Seller ID are required');
            }

            const existingProduct = await prisma.product.findFirst({
                where: { id: productId, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const images = parseProductImages(existingProduct.images);

            if (imageIndex < 0 || imageIndex >= images.length) {
                throw new Error('Invalid image index');
            }

            // Reset all images to not primary
            const updatedImages = images.map((img, index) => ({
                ...img,
                isPrimary: index === imageIndex
            }));

            const product = await prisma.product.update({
                where: { id: productId },
                data: { images: updatedImages }
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error setting primary image: ${error.message}`);
        }
    }

    // Remove image from product
    async removeProductImage(productId: string, sellerId: string, imageIndex: number): Promise<Product> {
        try {
            if (!productId || !sellerId) {
                throw new Error('Product ID and Seller ID are required');
            }

            const existingProduct = await prisma.product.findFirst({
                where: { id: productId, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const images = parseProductImages(existingProduct.images);

            if (imageIndex < 0 || imageIndex >= images.length) {
                throw new Error('Invalid image index');
            }

            const imageToRemove = images[imageIndex];

            if (!imageToRemove) {
                throw new Error('Image not found');
            }

            // Delete from storage (support both legacy S3 and current GCS)
            try {
                await gcpStorageService.deleteFile(imageToRemove.key);
            } catch (err) {
                // Fallback for legacy objects that might still be in S3
                try {
                    await s3Service.deleteFile(imageToRemove.key);
                } catch {
                    // Swallow secondary delete errors to avoid breaking UX
                }
            }

            // Remove from array
            const updatedImages = images.filter((_, index) => index !== imageIndex);

            // set the first one as primary if the primary image removed was and there are other images 
            if (imageToRemove!.isPrimary && updatedImages.length > 0) {
                if (updatedImages[0]) {
                    updatedImages[0].isPrimary = true;
                }
            }

            const product = await prisma.product.update({
                where: { id: productId },
                data: {
                    images: toPrismaJson(updatedImages)
                }
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error removing product image: ${error.message}`);
        }
    }

    // Get user's products
    async getUserProducts(userId: string, status?: ProductStatus, page: number = 1, limit: number = 10) {
        try {
            const skip = (page - 1) * limit;

            const where: any = { sellerId: userId, isActive: true };
            if (status) where.status = status;

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        seller: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        likes: true,
                        saves: true
                    },
                    orderBy: { createdAt: 'desc' },
                    skip,
                    take: limit
                }),
                prisma.product.count({ where })
            ]);

            return {
                products,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                total
            };
        } catch (error: any) {
            throw new Error(`Error fetching user products: ${error.message}`);
        }
    }

    // Update product status
    async updateProductStatus(productId: string, sellerId: string, status: ProductStatus): Promise<Product> {
        try {
            // Add validation for required parameters
            if (!productId || !sellerId) {
                throw new Error('Product ID and Seller ID are required');
            }

            const existingProduct = await prisma.product.findFirst({
                where: { id: productId, sellerId },
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const updateData: any = { status };
            const isNewlyPublished = status === ProductStatus.PUBLISHED && existingProduct!.status !== ProductStatus.PUBLISHED;
            const previousStatus = existingProduct!.status;

            if (isNewlyPublished) {
                updateData.publishedAt = new Date();
                // Set expiresAt to 5 days from now when product is published
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 5);
                updateData.expiresAt = expiresAt;
            }

            const product = await prisma.product.update({
                where: { id: productId },
                data: updateData,
                include: {
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });

            // Return product with flags indicating status changes
            return { ...product, _newlyPublished: isNewlyPublished, _previousStatus: previousStatus } as any;
        } catch (error: any) {
            throw new Error(`Error updating product status: ${error.message}`);
        }
    }

    // Get reviews and rating summary for a product
    async getProductReviews(productId: string): Promise<{
        reviews: (ProductReview & {
            user: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                profileImage: string | null;
            };
        })[];
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { [rating: number]: number };
    }> {
        try {
            const reviews = await prisma.productReview.findMany({
                where: { productId },
                include: {
                    user: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const totalReviews = reviews.length;
            const ratingDistribution: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            let sum = 0;
            for (const review of reviews) {
                sum += review.rating;
                if (review.rating >= 1 && review.rating <= 5) {
                    ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
                }
            }

            const averageRating = totalReviews > 0 ? parseFloat((sum / totalReviews).toFixed(1)) : 0;

            return {
                reviews,
                averageRating,
                totalReviews,
                ratingDistribution
            };
        } catch (error: any) {
            throw new Error(`Error fetching product reviews: ${error.message}`);
        }
    }

    // Create or update a product review for the current user
    async upsertProductReview(productId: string, userId: string, rating: number, comment?: string): Promise<ProductReview> {
        try {
            if (!productId || !userId) {
                throw new Error('Product ID and User ID are required');
            }

            const product = await prisma.product.findUnique({ where: { id: productId } });

            if (!product || !product.isActive) {
                throw new Error('Product not found');
            }

            const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));

            const review = await prisma.productReview.upsert({
                where: {
                    productId_userId: {
                        productId,
                        userId
                    }
                },
                update: {
                    rating: clampedRating,
                    comment
                },
                create: {
                    productId,
                    userId,
                    rating: clampedRating,
                    comment
                }
            });

            return review;
        } catch (error: any) {
            throw new Error(`Error saving review: ${error.message}`);
        }
    }

    // Save a product (bookmark)
    async saveProduct(productId: string, userId: string): Promise<void> {
        try {
            // Check if product exists
            const product = await prisma.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                throw new Error('Product not found');
            }

            // Check if already saved
            const existingSave = await prisma.productSave.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });

            if (existingSave) {
                // Already saved, do nothing
                return;
            }

            // Create save
            await prisma.productSave.create({
                data: {
                    userId,
                    productId
                }
            });
        } catch (error: any) {
            if (error.code === 'P2002') {
                // Unique constraint violation - already saved
                return;
            }
            throw new Error(`Error saving product: ${error.message}`);
        }
    }

    // Unsave a product (remove bookmark)
    async unsaveProduct(productId: string, userId: string): Promise<void> {
        try {
            await prisma.productSave.deleteMany({
                where: {
                    userId,
                    productId
                }
            });
        } catch (error: any) {
            throw new Error(`Error unsaving product: ${error.message}`);
        }
    }

    // Check if product is saved by user
    async isProductSaved(productId: string, userId: string): Promise<boolean> {
        try {
            const save = await prisma.productSave.findUnique({
                where: {
                    userId_productId: {
                        userId,
                        productId
                    }
                }
            });
            return !!save;
        } catch (error: any) {
            throw new Error(`Error checking if product is saved: ${error.message}`);
        }
    }

    // Get all saved product IDs for a user
    async getSavedProductIds(userId: string): Promise<string[]> {
        try {
            const saves = await prisma.productSave.findMany({
                where: { userId },
                select: { productId: true }
            });
            return saves.map(save => save.productId);
        } catch (error: any) {
            throw new Error(`Error getting saved products: ${error.message}`);
        }
    }

    // Toggle save status (save if not saved, unsave if saved)
    async toggleSaveProduct(productId: string, userId: string): Promise<{ saved: boolean }> {
        try {
            const isSaved = await this.isProductSaved(productId, userId);
            
            if (isSaved) {
                await this.unsaveProduct(productId, userId);
                return { saved: false };
            } else {
                await this.saveProduct(productId, userId);
                return { saved: true };
            }
        } catch (error: any) {
            throw new Error(`Error toggling save status: ${error.message}`);
        }
    }
}