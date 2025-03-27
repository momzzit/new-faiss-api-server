const airtableAPI = require('../api/airtable');
const solarAPI = require('../api/solar');
const vectorUtils = require('../utils/vectorUtils');

class SearchService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        try {
            await vectorUtils.loadIndex();
            await vectorUtils.loadIdMap();
            this.initialized = true;
            return true;
        } catch (error) {
            console.error('Error initializing search service:', error);
            throw error;
        }
    }

    async search(query, limit = 5) {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Get query embedding
            const queryEmbedding = await solarAPI.getEmbedding(query);
            
            // Search for similar articles
            const searchResults = await vectorUtils.search(queryEmbedding, limit);
            
            // Get full article details from Airtable
            const articles = await Promise.all(
                searchResults.map(async (result) => {
                    const article = await airtableAPI.getArticleById(result.id);
                    return {
                        ...article.fields,
                        similarity: 1 - (result.distance / 2) // Convert distance to similarity score
                    };
                })
            );

            return articles;
        } catch (error) {
            console.error('Error performing search:', error);
            throw error;
        }
    }
}

module.exports = new SearchService(); 