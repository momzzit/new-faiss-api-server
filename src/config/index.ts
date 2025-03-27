import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// 필수 환경 변수 검증
const requiredEnvVars = [
    'AIRTABLE_API_KEY',
    'AIRTABLE_BASE_ID',
    'AIRTABLE_TABLE_NAME',
    'SOLAR_API_KEY',
    'SOLAR_API_URL'
] as const;

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const config = {
    server: {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development'
    },
    airtable: {
        apiKey: process.env.AIRTABLE_API_KEY!,
        baseId: process.env.AIRTABLE_BASE_ID!,
        tableName: process.env.AIRTABLE_TABLE_NAME!
    },
    solar: {
        apiKey: process.env.SOLAR_API_KEY!,
        apiUrl: process.env.SOLAR_API_URL!
    },
    faiss: {
        indexPath: process.env.FAISS_INDEX_PATH || path.join(__dirname, '../../data/faiss/index.faiss'),
        idMapPath: process.env.FAISS_ID_MAP_PATH || path.join(__dirname, '../../data/faiss/id_map.json')
    },
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        filePath: process.env.LOG_FILE_PATH || path.join(__dirname, '../../logs/app.log')
    }
} as const; 