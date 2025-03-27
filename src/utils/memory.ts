import { log } from './logger';

export class MemoryMonitor {
    private static instance: MemoryMonitor;
    private memoryThreshold: number;
    private checkInterval: NodeJS.Timeout | null = null;

    private constructor() {
        this.memoryThreshold = 0.8; // 80% 메모리 사용량 임계값
    }

    static getInstance(): MemoryMonitor {
        if (!MemoryMonitor.instance) {
            MemoryMonitor.instance = new MemoryMonitor();
        }
        return MemoryMonitor.instance;
    }

    startMonitoring(intervalMs: number = 60000): void {
        if (this.checkInterval) {
            return;
        }

        this.checkInterval = setInterval(() => {
            this.checkMemoryUsage();
        }, intervalMs);

        log.info('Memory monitoring started');
    }

    stopMonitoring(): void {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            log.info('Memory monitoring stopped');
        }
    }

    private checkMemoryUsage(): void {
        const used = process.memoryUsage();
        const total = used.heapTotal;
        const heapUsed = used.heapUsed;
        const external = used.external;
        const rss = used.rss;

        const heapUsageRatio = heapUsed / total;
        const externalUsageRatio = external / total;
        const rssUsageRatio = rss / total;

        log.info('Memory usage:', {
            heapUsed: `${Math.round(heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(total / 1024 / 1024)}MB`,
            external: `${Math.round(external / 1024 / 1024)}MB`,
            rss: `${Math.round(rss / 1024 / 1024)}MB`,
            heapUsageRatio: `${Math.round(heapUsageRatio * 100)}%`,
            externalUsageRatio: `${Math.round(externalUsageRatio * 100)}%`,
            rssUsageRatio: `${Math.round(rssUsageRatio * 100)}%`
        });

        if (heapUsageRatio > this.memoryThreshold) {
            log.warn('High memory usage detected, triggering garbage collection');
            if (global.gc) {
                global.gc();
            }
        }
    }

    setMemoryThreshold(threshold: number): void {
        if (threshold > 0 && threshold <= 1) {
            this.memoryThreshold = threshold;
            log.info(`Memory threshold set to ${threshold * 100}%`);
        }
    }
} 