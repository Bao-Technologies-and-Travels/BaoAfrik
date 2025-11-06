import { PrismaClient, Product, ProductStatus, SaleType, Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { s3Service } from './s3Service';

const prisma = new PrismaClient();

export interface CreateProductData {
    title: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    category: string;
    origin: string;
    location: string;
    saleType: 'DEFAULT' | 'URGENT';
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
    saleType?: 'DEFAULT' | 'URGENT';
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
    saleType?: SaleType;
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
        console.error('Error parsing product images:', error);
        return [];
    }
}

function toPrismaJson(images: ProductImage[]): Prisma.JsonArray {
    return images as unknown as Prisma.JsonArray;
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
            if (filters.saleType) where.saleType = filters.saleType;

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

            // Delete from S3
            await s3Service.deleteFile(imageToRemove.key);

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
                where: { id: productId, sellerId }
            });

            if (!existingProduct) {
                throw new Error('Product not found or unauthorized');
            }

            const updateData: any = { status };

            if (status === ProductStatus.PUBLISHED && existingProduct!.status !== ProductStatus.PUBLISHED) {
                updateData.publishedAt = new Date();
            }

            const product = await prisma.product.update({
                where: { id: productId },
                data: updateData
            });

            return product;
        } catch (error: any) {
            throw new Error(`Error updating product status: ${error.message}`);
        }
    }
}