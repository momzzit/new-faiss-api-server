import { Request, Response, NextFunction } from 'express';
import { log } from '../utils/logger';

export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const [seconds, nanoseconds] = process.hrtime(start);
        const duration = seconds * 1000 + nanoseconds / 1000000;

        log.info('API Performance', {
            method: req.method,
            path: req.path,
            duration: `${duration.toFixed(2)}ms`,
            statusCode: res.statusCode,
            userAgent: req.get('user-agent'),
            ip: req.ip
        });
    });

    next();
}; 