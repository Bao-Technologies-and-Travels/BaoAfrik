import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                profileImage?: string | null;
                isVerifiedSeller: boolean;
                emailVerified?: boolean;
            };
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireVerifiedSeller: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireResourceOwnership: (resourceUserIdField?: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map