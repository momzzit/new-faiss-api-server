const faiss = require('faiss-node');
const fs = require('fs').promises;
const path = require('path');

class VectorUtils {
    constructor() {
        this.index = null;
        this.idMap = new Map();
        this.indexPath = path.join(__dirname, '../../data/index.faiss');
        this.idMapPath = path.join(__dirname, '../../data/id_map.json');
    }

    async initializeIndex(dimension) {
        try {
            this.index = new faiss.IndexFlatL2(dimension);
            await this.saveIndex();
            return true;
        } catch (error) {
            console.error('Error initializing FAISS index:', error);
            throw error;
        }
    }

    async addVectors(vectors, ids) {
        try {
            if (!this.index) {
                throw new Error('Index not initialized');
            }

            // Add vectors to FAISS index
            this.index.add(vectors);

            // Update ID mapping
            for (let i = 0; i < ids.length; i++) {
                this.idMap.set(this.index.ntotal - ids.length + i, ids[i]);
            }

            await this.saveIndex();
            await this.saveIdMap();
            return true;
        } catch (error) {
            console.error('Error adding vectors to index:', error);
            throw error;
        }
    }

    async search(queryVector, k = 5) {
        try {
            if (!this.index) {
                throw new Error('Index not initialized');
            }

            const { distances, indices } = this.index.search(queryVector, k);
            const results = indices.map((idx, i) => ({
                id: this.idMap.get(idx),
                distance: distances[i]
            }));

            return results;
        } catch (error) {
            console.error('Error searching vectors:', error);
            throw error;
        }
    }

    async saveIndex() {
        try {
            await fs.mkdir(path.dirname(this.indexPath), { recursive: true });
            await fs.writeFile(this.indexPath, this.index.serialize());
        } catch (error) {
            console.error('Error saving index:', error);
            throw error;
        }
    }

    async saveIdMap() {
        try {
            await fs.mkdir(path.dirname(this.idMapPath), { recursive: true });
            await fs.writeFile(
                this.idMapPath,
                JSON.stringify(Array.from(this.idMap.entries()))
            );
        } catch (error) {
            console.error('Error saving ID map:', error);
            throw error;
        }
    }

    async loadIndex() {
        try {
            const indexData = await fs.readFile(this.indexPath);
            this.index = faiss.IndexFlatL2.deserialize(indexData);
            return true;
        } catch (error) {
            console.error('Error loading index:', error);
            throw error;
        }
    }

    async loadIdMap() {
        try {
            const idMapData = await fs.readFile(this.idMapPath, 'utf8');
            const entries = JSON.parse(idMapData);
            this.idMap = new Map(entries);
            return true;
        } catch (error) {
            console.error('Error loading ID map:', error);
            throw error;
        }
    }
}

module.exports = new VectorUtils(); 