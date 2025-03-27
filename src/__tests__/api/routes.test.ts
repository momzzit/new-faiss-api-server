import request from 'supertest';
import express from 'express';
import { router } from '../../api/routes';
import { config } from '../../config';
import { mockArticles } from '../mocks/article.mock';
import { mockAirtableService, mockSolarService, mockFaissService } from '../mocks/services.mock';

// 모의 서비스 주입
jest.mock('../../services/airtable.service', () => ({
    airtableService: mockAirtableService
}));

jest.mock('../../services/solar.service', () => ({
    solarService: mockSolarService
}));

jest.mock('../../services/faiss.service', () => ({
    faissService: mockFaissService
}));

const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return health check status', async () => {
        const response = await request(app).get('/api/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });

    it('should update index', async () => {
        const response = await request(app).post('/api/update-index');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('updatedCount');
        expect(mockAirtableService.getAllArticles).toHaveBeenCalled();
        expect(mockFaissService.addOrUpdateVectors).toHaveBeenCalled();
    });

    it('should search for articles', async () => {
        const query = '삼성전자 주가 하락 이유?';
        const response = await request(app)
            .post('/api/search')
            .send({ query, limit: 5 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('articles');
        expect(response.body).toHaveProperty('similarity');
        expect(Array.isArray(response.body.articles)).toBe(true);
        expect(Array.isArray(response.body.similarity)).toBe(true);
        expect(mockSolarService.getEmbedding).toHaveBeenCalledWith(query);
        expect(mockFaissService.search).toHaveBeenCalled();
    });
}); 