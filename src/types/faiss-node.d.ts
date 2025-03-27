declare module 'faiss-node' {
    export class Faiss {
        constructor(dimension: number);
        
        add(vectors: number[]): void;
        search(queryVector: number[], k: number): {
            distances: number[];
            indices: number[];
        };
        save(): Buffer;
        load(buffer: Buffer): void;
        ntotal(): number;
    }
} 