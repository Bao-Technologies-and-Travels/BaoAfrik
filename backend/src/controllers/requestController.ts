import { Request, Response } from 'express';
import { requestService } from '../services/requestService'

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
        role: string;
    };
};

export const RequestController = {
    // Create a new product request
    async createRequest(req: AuthenticatedRequest, res: Response) {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const request = await requestService.createRequest({
                ...req.body,
                user: { connect: { id: userId } }
            });

            return res.status(201).json(request);

        } catch (error) {
            console.error('Error creating request:', error);
            return res.status(500).json({ error: 'Failed to create request' });
        }
    },

    async getRequests(req: Request, res: Response) {
        try {
            const { status, userId, page = 1, limit = 10, origin, sellerLocation, minPrice, maxPrice } = req.query;

            // Determine target userId:
            // 1. If userId is explicitly provided in query, filter by that userId
            // 2. Otherwise, return all requests (no userId filter)
            // Note: This endpoint is public and shows all requests by default
            let targetUserId: string | undefined = undefined;

            if (userId) {
                // If userId is provided in query, filter by that userId
                targetUserId = userId as string;
            }
            // If no userId in query, targetUserId remains undefined (returns all requests)

            const result = await requestService.getRequests({
                status: status as string | undefined,
                userId: targetUserId,
                origin: origin as string | undefined,
                sellerLocation: sellerLocation as string | undefined,
                minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
                maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
                page: Number(page),
                limit: Number(limit)
            });

            return res.json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Error fetching requests:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to fetch requests'
            });
        }
    },

    async getRequestById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    error: 'Request ID is required'
                });
            }

            const request = await requestService.getRequestById(id);

            if (!request) {
                return res.status(404).json({ error: 'Request not found' });
            }

            return res.json(request);
        } catch (error) {
            console.error('Error fetching request:', error);
            return res.status(500).json({ error: 'Failed to fetch request' });
        }
    },

    async updateRequest(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;

            if (!id) {
                return res.status(400).json({
                    error: 'Request ID is required'
                });
            }

            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            // Check if request exists first
            const existingRequest = await requestService.getRequestById(id);
            if (!existingRequest) {
                return res.status(404).json({ error: 'Request not found' });
            }

            const isOwner = await requestService.isRequestOwner(id, userId);

            // Log for debugging
            console.log('Update request check:', {
                requestId: id,
                userId,
                requestUserId: existingRequest.userId,
                isOwner,
                userRole
            });

            if (!isOwner && userRole !== 'ADMIN') {
                return res.status(403).json({
                    error: 'Not authorized to update this request',
                    details: 'You can only update your own requests'
                });
            }

            const updatedRequest = await requestService.updateRequest(id, req.body);
            return res.json({
                success: true,
                data: updatedRequest
            });

        } catch (error) {
            console.error('Error updating request:', error);
            return res.status(500).json({ error: 'Failed to update request' });
        }
    },

    async deleteRequest(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const userId = req.user?.id;
            const userRole = req.user?.role;

            if (!id) {
                return res.status(400).json({
                    error: 'Request ID is required'
                });
            }

            if (!userId) {
                return res.status(401).json({ error: 'Authentication required' });
            }

            const isOwner = await requestService.isRequestOwner(id, userId);
            if (!isOwner && userRole !== 'ADMIN') {
                return res.status(403).json({ error: 'Not authorized to delete this request' });
            }

            await requestService.deleteRequest(id);
            return res.status(204).send();
        } catch (error) {
            console.error('Error deleting request:', error);
            return res.status(500).json({ error: 'Failed to delete request' });
        }
    }
};

export default RequestController;