const airtableAPI = require('./api/airtable');
const solarAPI = require('./api/solar');

async function testAPIs() {
    try {
        // 1. Airtable에서 기사 가져오기
        console.log('Fetching articles from Airtable...');
        const articles = await airtableAPI.getAllArticles();
        console.log(`Found ${articles.length} articles`);
        console.log('Sample article:', articles[0]);

        // 2. Solar API로 임베딩 생성
        console.log('\nGenerating embedding for sample text...');
        const sampleText = articles[0].fields['요약'];
        const embedding = await solarAPI.getEmbedding(sampleText);
        console.log('Embedding generated:', embedding.length, 'dimensions');

        // 3. 임베딩을 Airtable에 저장
        console.log('\nSaving embedding back to Airtable...');
        await airtableAPI.updateArticleEmbedding(articles[0].id, embedding);
        console.log('Embedding saved successfully');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// 테스트 실행
testAPIs(); 