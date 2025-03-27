const axios = require('axios');
const config = require('../../config/config');

class APIClient {
    constructor() {
        this.baseURL = process.env.NODE_ENV === 'production' 
            ? 'https://new-faiss-api-server.onrender.com:10000'  // Render 배포 URL with port
            : 'http://localhost:10000';   // 개발 환경 API URL
    }

    async searchArticles(query, limit = 5) {
        try {
            const response = await axios.post(`${this.baseURL}/search`, {
                query,
                limit
            });
            return response.data;
        } catch (error) {
            console.error('Error searching articles:', error);
            throw error;
        }
    }

    async updateIndex() {
        try {
            const response = await axios.post(`${this.baseURL}/update-index`);
            return response.data;
        } catch (error) {
            console.error('Error updating index:', error);
            throw error;
        }
    }
}

module.exports = new APIClient(); 