import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { config } from './config';
import { router } from './api/routes';
import { faissService } from './services/faiss.service';
import { logger, requestLogger, errorLogger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import { MemoryMonitor } from './utils/memory';
import { cacheService } from './services/cache.service';

const app = express();
const memoryMonitor = MemoryMonitor.getInstance();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(requestLogger);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', router);

// Error handling
app.use(errorLogger);
app.use(errorHandler);

// Initialize FAISS service
(async () => {
    try {
        await faissService.initialize();
        logger.info('FAISS service initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize FAISS service:', error);
        process.exit(1);
    }
})();

// 메모리 모니터링 시작
memoryMonitor.startMonitoring();

// 서버 시작 시 캐시 초기화 및 FAISS 인덱스 최적화
async function initializeServices() {
    try {
        await cacheService.clear();
        await faissService.optimizeIndex();
        logger.info('Services initialized successfully');
    } catch (error) {
        logger.error('Service initialization error:', error);
    }
}

// 서버 종료 시 정리
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    memoryMonitor.stopMonitoring();
    await cacheService.clear();
    process.exit(0);
});

initializeServices();

// Start server
app.listen(config.server.port, () => {
    logger.info(`Server running on port ${config.server.port}`);
    logger.info(`API Documentation available at http://localhost:${config.server.port}/api-docs`);
}); 