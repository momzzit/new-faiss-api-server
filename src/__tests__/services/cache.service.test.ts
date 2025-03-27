import { cacheService } from '../../services/cache.service';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('CacheService', () => {
    let mockRedis: jest.Mocked<Redis>;

    beforeEach(() => {
        mockRedis = {
            get: jest.fn(),
            setex: jest.fn(),
            del: jest.fn(),
            flushall: jest.fn(),
            on: jest.fn()
        } as any;

        (Redis as jest.Mock).mockImplementation(() => mockRedis);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get', () => {
        it('캐시된 데이터를 반환해야 함', async () => {
            const mockData = { id: 1, name: 'test' };
            mockRedis.get.mockResolvedValue(JSON.stringify(mockData));

            const result = await cacheService.get('test-key');
            expect(result).toEqual(mockData);
            expect(mockRedis.get).toHaveBeenCalledWith('test-key');
        });

        it('캐시가 없으면 null을 반환해야 함', async () => {
            mockRedis.get.mockResolvedValue(null);

            const result = await cacheService.get('test-key');
            expect(result).toBeNull();
        });
    });

    describe('set', () => {
        it('데이터를 캐시에 저장해야 함', async () => {
            const mockData = { id: 1, name: 'test' };
            await cacheService.set('test-key', mockData);

            expect(mockRedis.setex).toHaveBeenCalledWith(
                'test-key',
                expect.any(Number),
                JSON.stringify(mockData)
            );
        });
    });

    describe('getSearchResults', () => {
        it('검색 결과를 캐시에서 가져와야 함', async () => {
            const mockResults = [{ id: 1, similarity: 0.9 }];
            mockRedis.get.mockResolvedValue(JSON.stringify(mockResults));

            const result = await cacheService.getSearchResults('test query', 10);
            expect(result).toEqual(mockResults);
            expect(mockRedis.get).toHaveBeenCalledWith('search:test query:10');
        });
    });

    describe('setSearchResults', () => {
        it('검색 결과를 캐시에 저장해야 함', async () => {
            const mockResults = [{ id: 1, similarity: 0.9 }];
            await cacheService.setSearchResults('test query', 10, mockResults);

            expect(mockRedis.setex).toHaveBeenCalledWith(
                'search:test query:10',
                1800,
                JSON.stringify(mockResults)
            );
        });
    });
}); 