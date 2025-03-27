const { IndexFlatL2 } = require('faiss-node');

let index = null;
let articleIds = [];

async function createIndex(embeddings, ids) {
  try {
    index = new IndexFlatL2(embeddings[0].length);
    index.add(embeddings);
    articleIds = ids;
  } catch (error) {
    console.error('Error creating FAISS index:', error);
    throw error;
  }
}

async function searchIndex(queryEmbedding, k = 5) {
  try {
    if (!index) {
      throw new Error('FAISS index is not initialized');
    }

    const { distances, indices } = index.search([queryEmbedding], k);
    
    return indices[0].map((idx, i) => ({
      id: articleIds[idx],
      similarity: 1 / (1 + distances[0][i]),
    }));
  } catch (error) {
    console.error('Error searching FAISS index:', error);
    throw error;
  }
}

module.exports = {
  createIndex,
  searchIndex,
}; 