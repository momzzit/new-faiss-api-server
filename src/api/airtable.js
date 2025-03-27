const axios = require('axios');
require('dotenv').config();

class AirtableAPI {
    constructor() {
        this.baseURL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`;
        this.headers = {
            'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json'
        };
    }

    async getAllArticles() {
        try {
            const response = await axios.get(this.baseURL, { 
                headers: this.headers,
                params: {
                    // 최신 기사부터 가져오기
                    'sort[0][field]': '생성 일시',
                    'sort[0][direction]': 'desc',
                    // 필요한 필드만 가져오기
                    'fields[]': ['제목', '요약', '생성 일시', 'embedding']
                }
            });
            return response.data.records;
        } catch (error) {
            console.error('Error fetching articles from Airtable:', error.response?.data || error);
            throw error;
        }
    }

    async updateArticleEmbedding(recordId, embedding) {
        try {
            const response = await axios.patch(
                `${this.baseURL}/${recordId}`,
                {
                    fields: {
                        'embedding': JSON.stringify(embedding)
                    }
                },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating article embedding:', error);
            throw error;
        }
    }

    async getArticlesByIds(recordIds) {
        try {
            // Airtable API는 한 번에 최대 10개의 레코드만 조회 가능
            const chunks = [];
            for (let i = 0; i < recordIds.length; i += 10) {
                chunks.push(recordIds.slice(i, i + 10));
            }

            const results = [];
            for (const chunk of chunks) {
                const formula = `OR(${chunk.map(id => `RECORD_ID()='${id}'`).join(',')})`;
                const response = await axios.get(this.baseURL, {
                    headers: this.headers,
                    params: {
                        filterByFormula: formula,
                        fields: ['title', 'summary', 'url', 'company', 'date']
                    }
                });
                results.push(...response.data.records);
            }
            return results;
        } catch (error) {
            console.error('Error fetching articles by IDs:', error);
            throw error;
        }
    }

    async updateArticle(recordId, fields) {
        try {
            const response = await axios.patch(
                `${this.baseURL}/${recordId}`,
                { fields },
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating article in Airtable:', error);
            throw error;
        }
    }

    async getArticleById(recordId) {
        try {
            const response = await axios.get(
                `${this.baseURL}/${recordId}`,
                { headers: this.headers }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching article from Airtable:', error);
            throw error;
        }
    }

    // MarketView 테이블에 맞는 특화 메서드들
    async getArticlesByCompany(companyName) {
        try {
            const response = await axios.get(
                `${this.baseURL}?filterByFormula={company}='${companyName}'`,
                { headers: this.headers }
            );
            return response.data.records;
        } catch (error) {
            console.error('Error fetching articles by company:', error);
            throw error;
        }
    }

    async getArticlesByDateRange(startDate, endDate) {
        try {
            const response = await axios.get(
                `${this.baseURL}?filterByFormula=AND({date}>='${startDate}',{date}<='${endDate}')`,
                { headers: this.headers }
            );
            return response.data.records;
        } catch (error) {
            console.error('Error fetching articles by date range:', error);
            throw error;
        }
    }
}

module.exports = new AirtableAPI(); 