const axios = require('axios');
require('dotenv').config();

class SolarAPI {
    constructor() {
        this.baseURL = process.env.SOLAR_API_URL;  // Solar API의 실제 URL
        this.headers = {
            'Authorization': `Bearer ${process.env.SOLAR_API_KEY}`,
            'Content-Type': 'application/json'
        };
    }

    async getEmbedding(text) {
        try {
            const response = await axios.post(
                `${this.baseURL}/embeddings`,
                {
                    input: text,
                    model: 'embedding-query'
                },
                { headers: this.headers }
            );
            return response.data.data[0].embedding;
        } catch (error) {
            console.error('Error getting embedding from Solar API:', error.response?.data || error);
            throw error;
        }
    }

    async getBatchEmbeddings(texts) {
        try {
            // 텍스트 배열을 청크로 나누기 (API 제한 고려)
            const chunkSize = 10;
            const chunks = [];
            for (let i = 0; i < texts.length; i += chunkSize) {
                chunks.push(texts.slice(i, i + chunkSize));
            }

            const allEmbeddings = [];
            for (const chunk of chunks) {
                const response = await axios.post(
                    `${this.baseURL}/embeddings`,
                    {
                        input: chunk,
                        model: 'embedding-query'
                    },
                    { headers: this.headers }
                );
                allEmbeddings.push(...response.data.data.map(item => item.embedding));
            }
            return allEmbeddings;
        } catch (error) {
            console.error('Error getting batch embeddings from Solar API:', error.response?.data || error);
            throw error;
        }
    }
}

module.exports = new SolarAPI(); 