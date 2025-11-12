import { Request, Response, NextFunction } from 'express';

export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
export type ErrorRequestHandler = (error: any, req: Request, res: Response, next: NextFunction) => void;