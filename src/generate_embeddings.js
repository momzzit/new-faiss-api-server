const airtableAPI = require('./api/airtable');
const solarAPI = require('./api/solar');

async function generateAndSaveEmbeddings() {
    try {
        // 1. 모든 기사 가져오기
        console.log('Fetching articles from Airtable...');
        const articles = await airtableAPI.getAllArticles();
        console.log(`Found ${articles.length} articles`);

        // 2. 각 기사에 대해 임베딩 생성 및 저장
        for (let i = 0; i < articles.length; i++) {
            const article = articles[i];
            const text = `${article.fields['제목']}\n${article.fields['요약']}`;
            
            console.log(`\nProcessing article ${i + 1}/${articles.length}:`);
            console.log(`Title: ${article.fields['제목']}`);

            try {
                // 임베딩 생성
                console.log('Generating embedding...');
                const embedding = await solarAPI.getEmbedding(text);
                console.log(`Embedding generated: ${embedding.length} dimensions`);

                // Airtable에 저장
                console.log('Saving embedding to Airtable...');
                await airtableAPI.updateArticleEmbedding(article.id, embedding);
                console.log('Embedding saved successfully');

                // API 호출 제한을 위한 딜레이
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error processing article ${i + 1}:`, error);
                // 에러가 발생해도 다음 기사로 계속 진행
                continue;
            }
        }

        console.log('\nAll articles processed successfully!');
    } catch (error) {
        console.error('Error in generateAndSaveEmbeddings:', error);
    }
}

// 스크립트 실행
generateAndSaveEmbeddings(); 