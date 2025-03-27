export interface Article {
    id: string;
    title: string;
    content: string;
    url: string;
    company: string;
    embedding?: number[];
    createdAt: string;
    updatedAt: string;
}

export interface SearchQuery {
    query: string;
    limit?: number;
}

export interface SearchResult {
    articles: Article[];
    similarity: number[];
}

export interface EmbeddingResponse {
    embedding: number[];
    error?: string;
}

export interface UpdateIndexResponse {
    success: boolean;
    message: string;
    updatedCount?: number;
    error?: string;
}

export interface ApiError {
    success: false;
    message: string;
    error: string;
}

export interface HealthCheckResponse {
    status: 'ok';
}

export interface FaissSearchResult {
    ids: string[];
    distances: number[];
} 