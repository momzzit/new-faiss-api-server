export interface SearchResult {
  id: string;
  title: string;
  content: string;
  similarity: number;
}

export interface SearchResponse {
  results: SearchResult[];
} 