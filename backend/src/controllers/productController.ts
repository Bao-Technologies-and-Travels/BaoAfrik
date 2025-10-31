import { Request, Response } from 'express';
import prisma from '@/config/database';

export class ProductController {
    getProductById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'Product ID is required'
                });
            }

            const product = await prisma.product.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    currency: true,
                    category: true,
                    location: true,
                    country: true,
                    images: true,
                    specifications: true,
                    seller: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                            email: true
                        }
                    }
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            return res.json({
                success: true,
                data: product
            });
        } catch (error) {
            console.error('Get product by ID error:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to get product'
            });
        }
    };
}