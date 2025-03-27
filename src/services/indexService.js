const airtableAPI = require('../api/airtable');
const solarAPI = require('../api/solar');
const vectorUtils = require('../utils/vectorUtils');

class IndexService {
    constructor() {
        this.initialized = false;
    }

    async initialize() {
        try {
            // Try to load existing index
            await vectorUtils.loadIndex();
            await vectorUtils.loadIdMap();
            this.initialized = true;
            return true;
        } catch (error) {
            console.log('No existing index found, initializing new one...');
            // Initialize new index with Solar API dimension
            await vectorUtils.initializeIndex(1536); // Solar API embedding dimension
            this.initialized = true;
            return true;
        }
    }

    async updateIndex() {
        try {
            if (!this.initialized) {
                await this.initialize();
            }

            // Get all articles from Airtable
            const articles = await airtableAPI.getAllArticles();
            
            // Extract text for embedding
            const texts = articles.map(article => article.fields.summary);
            
            // Get embeddings from Solar API
            const embeddings = await solarAPI.getBatchEmbeddings(texts);
            
            // Get article IDs
            const ids = articles.map(article => article.id);
            
            // Add vectors to FAISS index
            await vectorUtils.addVectors(embeddings, ids);
            
            // Update Airtable with embedding vectors
            for (let i = 0; i < articles.length; i++) {
                await airtableAPI.updateArticle(ids[i], {
                    embedding: embeddings[i]
                });
            }

            return true;
        } catch (error) {
            console.error('Error updating index:', error);
            throw error;
        }
    }
}

module.exports = new IndexService(); 