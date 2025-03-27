import { Faiss } from 'faiss-node';
import fs from 'fs/promises';
import path from 'path';
import { config } from '../config';
import { Article, FaissSearchResult } from '../types';
import { log } from '../utils/logger';
import axios from 'axios';
import { cacheService } from './cache.service';

class FaissService {
    private faiss: Faiss | null = null;
    private idMap: Map<number, string> = new Map();
    private readonly baseUrl: string;
    private readonly batchSize = 100; // 벡터 검색 배치 크기
    private readonly cacheTTL = 1800; // 30분

    constructor() {
        this.baseUrl = config.faiss.apiUrl;
    }

    async initialize(): Promise<void> {
        try {
            // Create directory if it doesn't exist
            await fs.mkdir(path.dirname(config.faiss.indexPath), { recursive: true });
            
            this.faiss = new Faiss(128); // Dimension of Solar API embeddings
            
            // Try to load existing index
            try {
                await this.loadIndex();
                log.info('FAISS index loaded successfully', {
                    indexPath: config.faiss.indexPath,
                    idMapPath: config.faiss.idMapPath
                });
            } catch (error) {
                log.info('No existing index found, creating new one', {
                    indexPath: config.faiss.indexPath
                });
            }
        } catch (error) {
            log.error('Error initializing FAISS service:', error);
            throw error;
        }
    }

    async loadIndex(): Promise<void> {
        if (!this.faiss) throw new Error('FAISS not initialized');

        const indexBuffer = await fs.readFile(config.faiss.indexPath);
        const idMapJson = await fs.readFile(config.faiss.idMapPath, 'utf-8');
        
        this.faiss.load(indexBuffer);
        this.idMap = new Map(Object.entries(JSON.parse(idMapJson)).map(([k, v]) => [Number(k), v as string]));
        
        log.debug('Index loaded', {
            vectorCount: this.faiss.ntotal(),
            idMapSize: this.idMap.size
        });
    }

    async saveIndex(): Promise<void> {
        if (!this.faiss) throw new Error('FAISS not initialized');
        
        const indexBuffer = this.faiss.save();
        const idMapJson = JSON.stringify(Object.fromEntries(this.idMap));
        
        await fs.writeFile(config.faiss.indexPath, indexBuffer);
        await fs.writeFile(config.faiss.idMapPath, idMapJson);
        
        log.debug('Index saved', {
            vectorCount: this.faiss.ntotal(),
            idMapSize: this.idMap.size
        });
    }

    async addOrUpdateVectors(articles: Article[]): Promise<void> {
        if (!this.faiss) throw new Error('FAISS not initialized');

        const startTime = Date.now();
        let addedCount = 0;

        for (const article of articles) {
            if (!article.embedding) continue;

            const index = this.faiss.ntotal();
            this.faiss.add(article.embedding);
            this.idMap.set(index, article.id);
            addedCount++;
        }

        await this.saveIndex();

        log.info('Vectors added to index', {
            totalArticles: articles.length,
            addedCount,
            processingTime: `${Date.now() - startTime}ms`
        });
    }

    async search(queryVector: number[], limit: number = 5): Promise<FaissSearchResult> {
        if (!this.faiss) throw new Error('FAISS not initialized');

        const startTime = Date.now();
        const { distances, indices } = this.faiss.search(queryVector, limit);
        const ids = indices.map(idx => {
            const id = this.idMap.get(idx);
            if (!id) throw new Error(`No ID found for index ${idx}`);
            return id;
        });

        log.debug('Vector search completed', {
            queryVectorLength: queryVector.length,
            resultCount: ids.length,
            processingTime: `${Date.now() - startTime}ms`
        });

        return { ids, distances };
    }

    async searchVectors(query: string, limit: number = 10): Promise<any[]> {
        try {
            // 캐시 확인
            const cachedResults = await cacheService.getSearchResults(query, limit);
            if (cachedResults) {
                log.info('Cache hit for vector search:', query);
                return cachedResults;
            }

            // 벡터 검색 요청
            const response = await axios.post(`${this.baseUrl}/search`, {
                query,
                limit: Math.min(limit, this.batchSize),
                include_metadata: true
            });

            const results = response.data.results;
            
            // 결과 캐싱
            await cacheService.setSearchResults(query, limit, results);

            return results;
        } catch (error) {
            log.error('Vector search error:', error);
            throw error;
        }
    }

    async batchSearch(queries: string[], limit: number = 10): Promise<any[]> {
        try {
            const promises = queries.map(query => this.searchVectors(query, limit));
            return await Promise.all(promises);
        } catch (error) {
            log.error('Batch vector search error:', error);
            throw error;
        }
    }

    // 벡터 인덱스 최적화
    async optimizeIndex(): Promise<void> {
        try {
            await axios.post(`${this.baseUrl}/optimize`);
            log.info('FAISS index optimized successfully');
        } catch (error) {
            log.error('FAISS index optimization error:', error);
            throw error;
        }
    }

    // 메모리 사용량 모니터링
    async getMemoryUsage(): Promise<any> {
        try {
            const response = await axios.get(`${this.baseUrl}/memory`);
            return response.data;
        } catch (error) {
            log.error('Memory usage check error:', error);
            throw error;
        }
    }
}

export const faissService = new FaissService(); 