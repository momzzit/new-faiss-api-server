import express, { Request, Response } from 'express';
import { airtableService } from '../services/airtable.service';
import { solarService } from '../services/solar.service';
import { faissService } from '../services/faiss.service';
import { logger } from '../utils/logger';
import { SearchQuery, ApiError, HealthCheckResponse, UpdateIndexResponse, SearchResult } from '../types';

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 */
router.get('/health', (req: Request, res: Response<HealthCheckResponse>) => {
    res.json({ status: 'ok' });
});

/**
 * @swagger
 * /api/update-index:
 *   post:
 *     summary: Update the FAISS index
 *     description: Fetches articles from Airtable, generates embeddings, and updates the FAISS index
 *     responses:
 *       200:
 *         description: Index updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Index updated successfully
 *                 updatedCount:
 *                   type: number
 *                   example: 100
 *       500:
 *         description: Server error
 */
router.post('/update-index', async (req: Request, res: Response<UpdateIndexResponse | ApiError>) => {
    try {
        const articles = await airtableService.getAllArticles();
        
        // Get embeddings for articles without them
        for (const article of articles) {
            if (!article.embedding) {
                const embedding = await solarService.getEmbedding(article.content);
                await airtableService.updateArticleEmbedding(article.id, embedding);
                article.embedding = embedding;
            }
        }

        // Update FAISS index
        await faissService.addOrUpdateVectors(articles);

        res.json({
            success: true,
            message: 'Index updated successfully',
            updatedCount: articles.length
        });
    } catch (error) {
        logger.error('Error updating index:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating index',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * @swagger
 * /api/search:
 *   post:
 *     summary: Search for similar articles
 *     description: Converts the query to a vector and finds similar articles using FAISS
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: "삼성전자 주가 하락 이유?"
 *               limit:
 *                 type: number
 *                 default: 5
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchResult'
 *       500:
 *         description: Server error
 */
router.post('/search', async (req: Request<{}, {}, SearchQuery>, res: Response<SearchResult | ApiError>) => {
    try {
        const { query, limit = 5 } = req.body;
        
        // Get query embedding
        const queryEmbedding = await solarService.getEmbedding(query);
        
        // Search similar articles
        const { ids, distances } = await faissService.search(queryEmbedding, limit);
        
        // Get full article data
        const articles = await airtableService.getAllArticles();
        const matchedArticles = articles.filter(article => ids.includes(article.id));
        
        res.json({
            articles: matchedArticles,
            similarity: distances
        });
    } catch (error) {
        logger.error('Error searching:', error);
        res.status(500).json({
            success: false,
            message: 'Error searching',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export { router }; 