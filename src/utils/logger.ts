import winston from 'winston';
import { config } from '../config';

// 로그 포맷 정의
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// 콘솔 출력용 포맷
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
    })
);

// 로그 레벨별 파일 설정
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// 로거 인스턴스 생성
const logger = winston.createLogger({
    levels: logLevels,
    format: logFormat,
    transports: [
        // 에러 로그 파일
        new winston.transports.File({
            filename: config.logging.filePath.replace('.log', '-error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // 모든 로그 파일
        new winston.transports.File({
            filename: config.logging.filePath,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        // 콘솔 출력
        new winston.transports.Console({
            format: consoleFormat,
            level: config.logging.level
        })
    ]
});

// 로그 레벨별 헬퍼 함수
export const log = {
    error: (message: string, meta?: any) => {
        logger.error(message, meta);
    },
    warn: (message: string, meta?: any) => {
        logger.warn(message, meta);
    },
    info: (message: string, meta?: any) => {
        logger.info(message, meta);
    },
    http: (message: string, meta?: any) => {
        logger.http(message, meta);
    },
    debug: (message: string, meta?: any) => {
        logger.debug(message, meta);
    }
};

// API 요청 로깅 미들웨어
export const requestLogger = (req: any, res: any, next: any) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        log.http(`${req.method} ${req.originalUrl}`, {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
    });
    
    next();
};

// 에러 로깅 미들웨어
export const errorLogger = (err: Error, req: any, res: any, next: any) => {
    log.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });
    
    next(err);
};

export { logger }; 