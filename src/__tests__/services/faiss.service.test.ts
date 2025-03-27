import { faissService } from '../../services/faiss.service';
import { cacheService } from '../../services/cache.service';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../services/cache.service');

describe('FaissService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('searchVectors', () => {
        it('캐시된 결과가 있으면 캐시에서 반환해야 함', async () => {
            const mockResults = [
                { id: '1', similarity: 0.9 },
                { id: '2', similarity: 0.8 }
            ];
            (cacheService.getSearchResults as jest.Mock).mockResolvedValue(mockResults);

            const results = await faissService.searchVectors('테스트 쿼리');
            expect(results).toEqual(mockResults);
            expect(axios.post).not.toHaveBeenCalled();
        });

        it('캐시가 없으면 API를 호출하고 결과를 캐시해야 함', async () => {
            const mockResults = [
                { id: '1', similarity: 0.9 },
                { id: '2', similarity: 0.8 }
            ];
            (cacheService.getSearchResults as jest.Mock).mockResolvedValue(null);
            (axios.post as jest.Mock).mockResolvedValue({ data: { results: mockResults } });

            const results = await faissService.searchVectors('테스트 쿼리');
            expect(results).toEqual(mockResults);
            expect(axios.post).toHaveBeenCalled();
            expect(cacheService.setSearchResults).toHaveBeenCalled();
        });
    });

    describe('batchSearch', () => {
        it('여러 쿼리에 대한 검색을 수행해야 함', async () => {
            const queries = ['쿼리1', '쿼리2'];
            const mockResults = [
                [{ id: '1', similarity: 0.9 }],
                [{ id: '2', similarity: 0.8 }]
            ];
            (cacheService.getSearchResults as jest.Mock)
                .mockResolvedValueOnce(mockResults[0])
                .mockResolvedValueOnce(mockResults[1]);

            const results = await faissService.batchSearch(queries);
            expect(results).toEqual(mockResults);
        });
    });

    describe('optimizeIndex', () => {
        it('인덱스 최적화 API를 호출해야 함', async () => {
            await faissService.optimizeIndex();
            expect(axios.post).toHaveBeenCalledWith(
                expect.stringContaining('/optimize')
            );
        });
    });
}); 