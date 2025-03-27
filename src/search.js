const airtableAPI = require('./api/airtable');
const solarAPI = require('./api/solar');

// 코사인 유사도 계산 함수
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (normA * normB);
}

async function searchArticles(query, limit = 5) {
    try {
        // 1. 검색어의 임베딩 생성
        console.log('Generating embedding for search query...');
        const queryEmbedding = await solarAPI.getEmbedding(query);
        
        // 2. 모든 기사 가져오기
        console.log('Fetching articles from Airtable...');
        const articles = await airtableAPI.getAllArticles();
        
        // 3. 각 기사와의 유사도 계산
        const results = articles.map(article => {
            const articleEmbedding = JSON.parse(article.fields['embedding']);
            const similarity = cosineSimilarity(queryEmbedding, articleEmbedding);
            return {
                ...article,
                similarity
            };
        });
        
        // 4. 유사도 기준으로 정렬하고 상위 결과만 반환
        const topResults = results
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, limit);
            
        return topResults;
    } catch (error) {
        console.error('Error in searchArticles:', error);
        throw error;
    }
}

// 테스트를 위한 함수
async function testSearch() {
    try {
        const query = 'OCR 문서 인식';
        console.log(`\nSearching for: "${query}"`);
        
        const results = await searchArticles(query);
        
        console.log('\nTop results:');
        results.forEach((result, index) => {
            console.log(`\n${index + 1}. Similarity: ${result.similarity.toFixed(4)}`);
            console.log(`Title: ${result.fields['제목']}`);
            console.log(`Summary: ${result.fields['요약']}`);
        });
    } catch (error) {
        console.error('Error in test search:', error);
    }
}

// 테스트 실행
testSearch(); 