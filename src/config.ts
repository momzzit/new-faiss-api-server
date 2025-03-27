export const config = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || ''
    },
    airtable: {
        apiKey: process.env.AIRTABLE_API_KEY || '',
        baseId: process.env.AIRTABLE_BASE_ID || '',
        tableName: process.env.AIRTABLE_TABLE_NAME || 'Articles'
    },
    solar: {
        apiKey: process.env.SOLAR_API_KEY || '',
        apiUrl: process.env.SOLAR_API_URL || 'https://api.solar.com/v1'
    },
    faiss: {
        apiUrl: process.env.FAISS_API_URL || 'http://localhost:8000',
        indexPath: process.env.FAISS_INDEX_PATH || './data/faiss.index',
        idMapPath: process.env.FAISS_ID_MAP_PATH || './data/id-map.json'
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json'
    }
} as const; 