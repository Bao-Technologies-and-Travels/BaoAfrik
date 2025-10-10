import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}
export declare class CustomError extends Error implements AppError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorHandler: (error: unknown, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const createValidationError: (message: string, field?: string) => CustomError;
export declare const createNotFoundError: (resource?: string) => CustomError;
export declare const createUnauthorizedError: (message?: string) => CustomError;
export declare const createForbiddenError: (message?: string) => CustomError;
export declare const createConflictError: (message?: string) => CustomError;
//# sourceMappingURL=errorMiddleware.d.ts.map