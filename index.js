require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const indexService = require('./src/services/indexService');
const searchService = require('./src/services/searchService');
const { searchArticles } = require('./src/services/search');

const app = express();
const port = process.env.PORT || 3000;

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

app.post('/api/search', async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: '검색어를 입력해주세요.' });
        }

        const results = await searchArticles(query);
        res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

// 기본 라우트
app.get('/', (req, res) => {
    res.json({ message: 'FAISS API 서버가 정상적으로 실행 중입니다.' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

