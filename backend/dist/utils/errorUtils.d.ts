export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly isOperational: boolean;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare const createError: (message: string, statusCode?: number, code?: string) => AppError;
export declare const createValidationError: (message?: string) => AppError;
export declare const createUnauthorizedError: (message?: string) => AppError;
export declare const createForbiddenError: (message?: string) => AppError;
export declare const createNotFoundError: (message?: string) => AppError;
export declare const createConflictError: (message?: string) => AppError;
export declare const createTooManyRequestsError: (message?: string) => AppError;
export declare const isOperationalError: (error: Error) => boolean;
//# sourceMappingURL=errorUtils.d.ts.map