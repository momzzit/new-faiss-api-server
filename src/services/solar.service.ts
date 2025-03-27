import axios from 'axios';
import { config } from '../config';
import { log } from '../utils/logger';

class SolarService {
    private readonly apiUrl: string;
    private readonly apiKey: string;

    constructor() {
        this.apiUrl = config.solar.apiUrl;
        this.apiKey = config.solar.apiKey;
    }

    async getEmbedding(text: string): Promise<number[]> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/embed`,
                { text },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.embedding;
        } catch (error) {
            log.error('Solar API embedding error:', error);
            throw error;
        }
    }

    async batchGetEmbeddings(texts: string[]): Promise<number[][]> {
        try {
            const response = await axios.post(
                `${this.apiUrl}/batch-embed`,
                { texts },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.embeddings;
        } catch (error) {
            log.error('Solar API batch embedding error:', error);
            throw error;
        }
    }
}

export const solarService = new SolarService(); 