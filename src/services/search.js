const { VertexAI } = require('@google-cloud/vertexai');
const Airtable = require('airtable');
const { createIndex, searchIndex } = require('../../utils/faiss');

const vertex = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
});

const model = vertex.preview.getGenerativeModel({
  model: 'gemini-pro',
});

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

async function searchArticles(query) {
  try {
    // 쿼리 텍스트의 임베딩 생성
    const queryEmbedding = await generateEmbedding(query);
    
    // FAISS 인덱스 검색
    const searchResults = await searchIndex(queryEmbedding, 5);
    
    // Airtable에서 기사 정보 가져오기
    const articles = await Promise.all(
      searchResults.map(async (result) => {
        const record = await base('Articles').find(result.id);
        return {
          id: record.id,
          title: record.get('Title'),
          content: record.get('Content'),
          similarity: result.similarity,
        };
      })
    );

    return articles;
  } catch (error) {
    console.error('Error in searchArticles:', error);
    throw error;
  }
}

async function generateEmbedding(text) {
  try {
    const result = await model.embedContent({
      content: text,
      taskType: 'RETRIEVAL_DOCUMENT',
    });
    return result.embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

module.exports = {
  searchArticles,
}; 