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
    page?: number;
    limit?: number;
  }) {
    const { status, userId, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;
    
    const where: Prisma.ProductRequestWhereInput = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

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
              profileImage: true
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