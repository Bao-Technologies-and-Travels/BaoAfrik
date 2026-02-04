import prisma from '../config/database';
import { Product, ProductStatus, Prisma, ProductReview } from '../generated/client';
// import { s3Service } from './s3Service';
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

function slugify(title: string): string {
    if (!title || typeof title !== 'string') return '';
    return title
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+|-+$/g, '');
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

            const baseSlug = slugify(productData.title) || 'product';
            let slug = baseSlug;
            let n = 1;
            while (await prisma.product.findUnique({ where: { slug } })) {
                slug = `${baseSlug}-${n++}`;
            }

            const processedData = {
                ...productData,
                category: categoryMap[productData.category] || productData.category,
                sellerId,
                slug
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

    // Get product by slug (SEO-friendly URL, no id exposed). If slug looks like UUID, fall back to get by id (legacy/notifications).
    // Resolves by exact slug first; if not found, finds by slugified title (for products with null slug) and backfills slug.
    async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(slug)) {
                return this.getProductById(slug);
            }
            let product = await prisma.product.findUnique({
                where: { slug },
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

            // Fallback: resolve by slugified title (products with null slug or legacy data)
            if (!product) {
                const candidates = await prisma.product.findMany({
                    where: { status: ProductStatus.PUBLISHED, isActive: true },
                    select: { id: true, title: true, slug: true },
                    take: 500
                });
                const normalizedSlug = slug.toLowerCase().trim();
                const match = candidates.find(
                    (p) => p.slug === normalizedSlug || (slugify(p.title) === normalizedSlug)
                );
                if (match) {
                    if (!match.slug) {
                        let uniqueSlug = normalizedSlug;
                        let n = 1;
                        while (await prisma.product.findFirst({ where: { slug: uniqueSlug } })) {
                            uniqueSlug = `${normalizedSlug}-${n++}`;
                        }
                        await prisma.product.update({
                            where: { id: match.id },
                            data: { slug: uniqueSlug }
                        });
                    }
                    return this.getProductById(match.id);
                }
                return null;
            }

            await prisma.product.update({
                where: { id: product.id },
                data: { viewCount: { increment: 1 } }
            });
            return product;
        } catch (error: any) {
            throw new Error(`Error fetching product by slug: ${error.message}`);
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

    // Increment view count for a product (for tracking from homepage)
    async incrementViewCount(id: string): Promise<void> {
        try {
            await prisma.product.update({
                where: { id },
                data: { viewCount: { increment: 1 } }
            });
        } catch (error: any) {
            throw new Error(`Error incrementing view count: ${error.message}`);
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

            const data: any = { ...updateData };
            if (updateData.title !== undefined) {
                const baseSlug = slugify(updateData.title) || 'product';
                let slug = baseSlug;
                let n = 1;
                let existing = await prisma.product.findFirst({ where: { slug } });
                while (existing && existing.id !== id) {
                    slug = `${baseSlug}-${n++}`;
                    existing = await prisma.product.findFirst({ where: { slug } });
                }
                data.slug = slug;
            }

            const product = await prisma.product.update({
                where: { id },
                data,
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
                // Swallow secondary delete errors to avoid breaking UX
                console.error('Error deleting image from GCS:', err);
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
                // expiresAt: uncomment when DB has expires_at column
                // const expiresAt = new Date();
                // expiresAt.setDate(expiresAt.getDate() + 7);
                // updateData.expiresAt = expiresAt;
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

    // Get public user profile
    async getPublicUserProfile(userId: string): Promise<{
        id: string;
        firstName: string | null;
        lastName: string | null;
        profileImage: string | null;
        bio: string | null;
        location: string | null;
        isVerifiedSeller: boolean;
        createdAt: Date;
        rating: number;
        totalReviews: number;
    } | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    bio: true,
                    location: true,
                    isVerifiedSeller: true,
                    createdAt: true,
                    rating: true
                }
            });

            if (!user) {
                return null;
            }

            // Count total user reviews (not product reviews)
            const totalReviews = await (prisma as any).userReview.count({
                where: { userId }
            }).catch(() => 0);

            return {
                ...user,
                rating: user.rating || 0,
                totalReviews
            };
        } catch (error: any) {
            throw new Error(`Error fetching user profile: ${error.message}`);
        }
    }

    // Get reviews for a seller (user reviews, not product reviews)
    async getSellerReviews(sellerId: string, page: number = 1, limit: number = 10): Promise<{
        reviews: Array<{
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            reviewer: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                profileImage: string | null;
            };
            helpfulYesCount: number;
            helpfulNoCount: number;
        }>;
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { [rating: number]: number };
        totalPages: number;
        currentPage: number;
    }> {
        try {
            // Use getUserReviews instead (user reviews, not product reviews)
            return await this.getUserReviews(sellerId, page, limit);
        } catch (error: any) {
            throw new Error(`Error fetching seller reviews: ${error.message}`);
        }
    }

    // Vote on review helpfulness
    async voteReviewHelpfulness(reviewId: string, voterId: string, isHelpful: boolean): Promise<{
        helpfulYesCount: number;
        helpfulNoCount: number;
        userVote: 'yes' | 'no' | null;
    }> {
        try {
            // Check if review exists
            const review = await prisma.productReview.findUnique({
                where: { id: reviewId }
            });

            if (!review) {
                throw new Error('Review not found');
            }

            // Check for existing vote
            const existingVote = await prisma.reviewHelpfulness.findUnique({
                where: {
                    reviewId_userId: {
                        reviewId,
                        userId: voterId
                    }
                }
            });

            if (existingVote) {
                if (existingVote.isHelpful === isHelpful) {
                    // Same vote - remove it (toggle off)
                    await prisma.reviewHelpfulness.delete({
                        where: { id: existingVote.id }
                    });
                } else {
                    // Different vote - update it
                    await prisma.reviewHelpfulness.update({
                        where: { id: existingVote.id },
                        data: { isHelpful }
                    });
                }
            } else {
                // Create new vote
                await prisma.reviewHelpfulness.create({
                    data: {
                        reviewId,
                        userId: voterId,
                        isHelpful
                    }
                });
            }

            // Get updated counts
            const votes = await prisma.reviewHelpfulness.findMany({
                where: { reviewId }
            });

            const helpfulYesCount = votes.filter(v => v.isHelpful).length;
            const helpfulNoCount = votes.filter(v => !v.isHelpful).length;

            // Check user's current vote
            const userVoteRecord = await prisma.reviewHelpfulness.findUnique({
                where: {
                    reviewId_userId: {
                        reviewId,
                        userId: voterId
                    }
                }
            });

            const userVote = userVoteRecord ? (userVoteRecord.isHelpful ? 'yes' : 'no') : null;

            return {
                helpfulYesCount,
                helpfulNoCount,
                userVote
            };
        } catch (error: any) {
            throw new Error(`Error voting on review: ${error.message}`);
        }
    }

    // Get user's vote on a review
    async getUserReviewVote(reviewId: string, userId: string): Promise<'yes' | 'no' | null> {
        try {
            const vote = await prisma.reviewHelpfulness.findUnique({
                where: {
                    reviewId_userId: {
                        reviewId,
                        userId
                    }
                }
            });

            return vote ? (vote.isHelpful ? 'yes' : 'no') : null;
        } catch (error: any) {
            throw new Error(`Error getting user vote: ${error.message}`);
        }
    }

    // Get helpfulness counts for a review
    async getReviewHelpfulnessCounts(reviewId: string): Promise<{
        helpfulYesCount: number;
        helpfulNoCount: number;
    }> {
        try {
            const votes = await prisma.reviewHelpfulness.findMany({
                where: { reviewId }
            });

            return {
                helpfulYesCount: votes.filter(v => v.isHelpful).length,
                helpfulNoCount: votes.filter(v => !v.isHelpful).length
            };
        } catch (error: any) {
            throw new Error(`Error getting helpfulness counts: ${error.message}`);
        }
    }

    // Create or update a user/seller review (separate from product reviews)
    async upsertUserReview(userId: string, reviewerId: string, rating: number, comment?: string): Promise<any> {
        try {
            if (!userId || !reviewerId) {
                throw new Error('User ID and Reviewer ID are required');
            }

            const user = await prisma.user.findUnique({ where: { id: userId } });

            if (!user) {
                throw new Error('User not found');
            }

            const clampedRating = Math.min(5, Math.max(1, Math.round(rating)));

            const review = await (prisma as any).userReview.upsert({
                where: {
                    userId_reviewerId: {
                        userId,
                        reviewerId
                    }
                },
                update: {
                    rating: clampedRating,
                    comment
                },
                create: {
                    userId,
                    reviewerId,
                    rating: clampedRating,
                    comment
                },
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    }
                }
            });

            // Update user's average rating
            await this.updateUserRating(userId);

            return review;
        } catch (error: any) {
            throw new Error(`Error saving user review: ${error.message}`);
        }
    }

    // Get user/seller reviews (separate from product reviews)
    async getUserReviews(userId: string, page: number = 1, limit: number = 10): Promise<{
        reviews: Array<{
            id: string;
            rating: number;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            reviewer: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                profileImage: string | null;
            };
            helpfulYesCount: number;
            helpfulNoCount: number;
        }>;
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { [rating: number]: number };
        totalPages: number;
        currentPage: number;
    }> {
        try {
            const skip = (page - 1) * limit;

            const reviews = await (prisma as any).userReview.findMany({
                where: { userId },
                include: {
                    reviewer: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true
                        }
                    },
                    helpfulnessVotes: true
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            const allReviews = await (prisma as any).userReview.findMany({
                where: { userId },
                select: { rating: true }
            });

            const totalReviews = allReviews.length;
            const ratingDistribution: { [rating: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            let sum = 0;
            for (const review of allReviews) {
                sum += review.rating;
                if (review.rating >= 1 && review.rating <= 5) {
                    ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
                }
            }

            const averageRating = totalReviews > 0 ? parseFloat((sum / totalReviews).toFixed(1)) : 0;

            const formattedReviews = reviews.map((review: any) => {
                const helpfulYesCount = review.helpfulnessVotes.filter((v: any) => v.isHelpful).length;
                const helpfulNoCount = review.helpfulnessVotes.filter((v: any) => !v.isHelpful).length;

                return {
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    createdAt: review.createdAt,
                    updatedAt: review.updatedAt,
                    reviewer: review.reviewer,
                    helpfulYesCount,
                    helpfulNoCount
                };
            });

            return {
                reviews: formattedReviews,
                averageRating,
                totalReviews,
                ratingDistribution,
                totalPages: Math.ceil(totalReviews / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new Error(`Error fetching user reviews: ${error.message}`);
        }
    }

    // Update user's average rating based on user reviews
    async updateUserRating(userId: string): Promise<void> {
        try {
            const reviews = await (prisma as any).userReview.findMany({
                where: { userId },
                select: { rating: true }
            });

            if (reviews.length === 0) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { rating: 0 }
                });
                return;
            }

            const sum = reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
            const averageRating = parseFloat((sum / reviews.length).toFixed(1));

            await prisma.user.update({
                where: { id: userId },
                data: { rating: averageRating }
            });
        } catch (error: any) {
            throw new Error(`Error updating user rating: ${error.message}`);
        }
    }
}