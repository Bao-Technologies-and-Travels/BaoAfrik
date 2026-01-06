import { Router, Request, Response, NextFunction } from 'express';
import { RequestController } from '../controllers/requestController';
import { createRequestValidation, getRequestsValidation, updateRequestValidation, requestIdValidation, validate } from '../middleware/validationMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';

type AuthenticatedRequest = Request & {
    user?: {
        id: string;
        email: string;
        role: string;
        isVerifiedSeller: boolean;
        emailVerified?: boolean;
        profileImage?: string | null;
    };
};

// Type assertion for request handlers with authenticated request
type AuthenticatedRequestHandler = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => Promise<Response | void>;

// Helper function to handle authenticated routes
const handleAuthRoute = (handler: AuthenticatedRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return handler(req as AuthenticatedRequest, res, next);
    };
};

const router = Router();

// Public routes (but getRequests can handle authenticated requests)
router.get(
    '/',
    getRequestsValidation,
    validate,
    handleAuthRoute(RequestController.getRequests as AuthenticatedRequestHandler)
);

router.get(
    '/:id',
    requestIdValidation,
    validate,
    RequestController.getRequestById
);

// Protected routes (require authentication)
router.use(authenticateToken);

router.post(
    '/',
    authenticateToken,
    createRequestValidation,
    validate,
    handleAuthRoute(RequestController.createRequest as AuthenticatedRequestHandler)
);

router.put(
    '/:id',
    authenticateToken,
    [...requestIdValidation, ...updateRequestValidation],
    validate,
    handleAuthRoute(RequestController.updateRequest as AuthenticatedRequestHandler)
);

router.delete(
    '/:id',
    authenticateToken,
    requestIdValidation,
    validate,
    handleAuthRoute(RequestController.deleteRequest as AuthenticatedRequestHandler)
);

export default router;
