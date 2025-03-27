import Airtable from 'airtable';
import { config } from '../config';
import { log } from '../utils/logger';
import { Article } from '../types';

class AirtableService {
    private base: Airtable.Base;
    private table: Airtable.Table<any>;

    constructor() {
        this.base = new Airtable({ apiKey: config.airtable.apiKey }).base(config.airtable.baseId);
        this.table = this.base(config.airtable.tableName);
    }

    async getAllArticles(): Promise<Article[]> {
        try {
            const records = await this.table.select().all();
            return records.map(record => ({
                id: record.id,
                title: record.get('title') as string,
                content: record.get('content') as string,
                url: record.get('url') as string,
                publishedAt: record.get('publishedAt') as string,
                embedding: record.get('embedding') as number[],
                company: record.get('company') as string
            }));
        } catch (error) {
            log.error('Airtable get all articles error:', error);
            throw error;
        }
    }

    async getArticle(id: string): Promise<Article | null> {
        try {
            const record = await this.table.find(id);
            return {
                id: record.id,
                title: record.get('title') as string,
                content: record.get('content') as string,
                url: record.get('url') as string,
                publishedAt: record.get('publishedAt') as string,
                embedding: record.get('embedding') as number[],
                company: record.get('company') as string
            };
        } catch (error) {
            log.error('Airtable get article error:', error);
            return null;
        }
    }

    async updateArticle(id: string, data: Partial<Article>): Promise<void> {
        try {
            await this.table.update(id, data);
            log.info('Article updated successfully:', id);
        } catch (error) {
            log.error('Airtable update article error:', error);
            throw error;
        }
    }

    async updateEmbedding(id: string, embedding: number[]): Promise<void> {
        try {
            await this.table.update(id, { embedding });
            log.info('Article embedding updated successfully:', id);
        } catch (error) {
            log.error('Airtable update embedding error:', error);
            throw error;
        }
    }
}

export const airtableService = new AirtableService(); 