import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'News Search API',
            version: '1.0.0',
            description: 'API for searching news articles using FAISS vector similarity search',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            schemas: {
                Article: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        content: { type: 'string' },
                        url: { type: 'string' },
                        company: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                SearchQuery: {
                    type: 'object',
                    properties: {
                        query: { type: 'string' },
                        limit: { type: 'number', default: 5 }
                    },
                    required: ['query']
                },
                SearchResult: {
                    type: 'object',
                    properties: {
                        articles: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Article' }
                        },
                        similarity: {
                            type: 'array',
                            items: { type: 'number' }
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/api/routes.ts']
};

export const swaggerSpec = swaggerJsdoc(options); 