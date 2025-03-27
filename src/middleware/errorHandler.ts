import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError, NotFoundError, ExternalApiError, DatabaseError } from '../utils/errors';
import { logger } from '../utils/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error('Error occurred:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code
        });
        return;
    }

    // 기본 에러 응답
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        code: 'INTERNAL_SERVER_ERROR'
    });
}; 