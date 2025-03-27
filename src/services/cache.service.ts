import Redis from 'ioredis';
import { config } from '../config';
import { log } from '../utils/logger';

class CacheService {
    private redis: Redis;
    private readonly DEFAULT_TTL = 3600; // 1시간

    constructor() {
        this.redis = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            password: config.redis.password,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        this.redis.on('error', (error) => {
            log.error('Redis connection error:', error);
        });

        this.redis.on('connect', () => {
            log.info('Redis connected successfully');
        });
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.redis.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            log.error('Cache get error:', error);
            return null;
        }
    }

    async set(key: string, value: any, ttl: number = this.DEFAULT_TTL): Promise<void> {
        try {
            await this.redis.setex(key, ttl, JSON.stringify(value));
        } catch (error) {
            log.error('Cache set error:', error);
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (error) {
            log.error('Cache delete error:', error);
        }
    }

    async clear(): Promise<void> {
        try {
            await this.redis.flushall();
            log.info('Cache cleared successfully');
        } catch (error) {
            log.error('Cache clear error:', error);
        }
    }

    // 벡터 검색 결과 캐싱
    async getSearchResults(query: string, limit: number): Promise<any | null> {
        const key = `search:${query}:${limit}`;
        return this.get(key);
    }

    async setSearchResults(query: string, limit: number, results: any): Promise<void> {
        const key = `search:${query}:${limit}`;
        await this.set(key, results, 1800); // 30분 캐시
    }

    // 기사 데이터 캐싱
    async getArticle(id: string): Promise<any | null> {
        const key = `article:${id}`;
        return this.get(key);
    }

    async setArticle(id: string, article: any): Promise<void> {
        const key = `article:${id}`;
        await this.set(key, article, 7200); // 2시간 캐시
    }
}

export const cacheService = new CacheService(); 