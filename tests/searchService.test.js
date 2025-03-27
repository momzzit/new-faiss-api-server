const searchService = require('../src/services/searchService');
const solarAPI = require('../src/api/solar');
const vectorUtils = require('../src/utils/vectorUtils');
const airtableAPI = require('../src/api/airtable');

// Mock dependencies
jest.mock('../src/api/solar');
jest.mock('../src/utils/vectorUtils');
jest.mock('../src/api/airtable');

describe('SearchService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('search', () => {
        it('should return search results successfully', async () => {
            // Mock data
            const mockQuery = 'test query';
            const mockEmbedding = [0.1, 0.2, 0.3];
            const mockSearchResults = [
                { id: '1', distance: 0.1 },
                { id: '2', distance: 0.2 }
            ];
            const mockArticles = [
                { id: '1', title: 'Article 1', summary: 'Summary 1' },
                { id: '2', title: 'Article 2', summary: 'Summary 2' }
            ];

            // Mock implementations
            solarAPI.getEmbedding.mockResolvedValue(mockEmbedding);
            vectorUtils.search.mockResolvedValue(mockSearchResults);
            airtableAPI.getArticleById.mockImplementation((id) => 
                Promise.resolve({ fields: mockArticles.find(a => a.id === id) })
            );

            // Execute
            const results = await searchService.search(mockQuery);

            // Verify
            expect(solarAPI.getEmbedding).toHaveBeenCalledWith(mockQuery);
            expect(vectorUtils.search).toHaveBeenCalledWith(mockEmbedding, 5);
            expect(results).toHaveLength(2);
            expect(results[0].id).toBe('1');
            expect(results[1].id).toBe('2');
        });

        it('should handle errors gracefully', async () => {
            // Mock error
            solarAPI.getEmbedding.mockRejectedValue(new Error('API Error'));

            // Execute and verify
            await expect(searchService.search('test')).rejects.toThrow('API Error');
        });
    });
}); 