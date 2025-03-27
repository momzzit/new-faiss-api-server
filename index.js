const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const config = require('./config/config');
const indexService = require('./src/services/indexService');
const searchService = require('./src/services/searchService');

// 환경 변수 로드
dotenv.config();

const app = express();

// CORS 설정
const corsOptions = {
    origin: [
        'https://news-link-finder.lovable.app',
        'https://lovable.ai',
        'https://new-faiss-api-server.onrender.com',
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.post('/update-index', async (req, res) => {
    try {
        await indexService.updateIndex();
        res.json({ success: true, message: 'Index updated successfully' });
    } catch (error) {
        console.error('Error updating index:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/search', async (req, res) => {
    try {
        const { query, limit } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const results = await searchService.search(query, limit);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'FAISS API 서버가 정상적으로 실행 중입니다.' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});

