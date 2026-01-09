import prisma from '../config/database';
import { Prisma } from '../generated/client';

export const requestService = {
  async createRequest(data: Prisma.ProductRequestCreateInput) {
    return prisma.productRequest.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
  },

  async getRequests(params: {
    status?: string;
    userId?: string;
    origin?: string;
    sellerLocation?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) {
    const { status, userId, origin, sellerLocation, minPrice, maxPrice, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductRequestWhereInput = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (origin) where.origin = origin;
    if (sellerLocation) where.sellerLocation = { contains: sellerLocation, mode: 'insensitive' };

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      const andConditions: Prisma.ProductRequestWhereInput[] = [];
      if (minPrice !== undefined) {
        andConditions.push({
          OR: [
            { minPrice: { gte: minPrice } },
            { maxPrice: { gte: minPrice } }
          ]
        });
      }
      if (maxPrice !== undefined) {
        andConditions.push({
          OR: [
            { minPrice: { lte: maxPrice } },
            { maxPrice: { lte: maxPrice } }
          ]
        });
      }
      if (andConditions.length > 0) {
        where.AND = andConditions;
      }
    }

    const [requests, total] = await Promise.all([
      prisma.productRequest.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              profileImage: true,
              rating: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.productRequest.count({ where })
    ]);

    return {
      data: requests,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async getRequestById(id: string) {
    return prisma.productRequest.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
  },

  async updateRequest(id: string, data: Prisma.ProductRequestUpdateInput) {
    return prisma.productRequest.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            profileImage: true
          }
        }
      }
    });
  },

  async deleteRequest(id: string) {
    return prisma.productRequest.delete({
      where: { id }
    });
  },

  async isRequestOwner(requestId: string, userId: string) {
    const request = await prisma.productRequest.findUnique({
      where: { id: requestId },
      select: { userId: true }
    });
    return request?.userId === userId;
  }
};

export default requestService;