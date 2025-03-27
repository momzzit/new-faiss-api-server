import { config } from '../config';
import { log } from '../utils/logger';

// 테스트 환경 설정
process.env.NODE_ENV = 'test';

// 로깅 설정 변경
log.level = 'error';

// 전역 테스트 타임아웃 설정
jest.setTimeout(10000);

// 테스트 환경 변수 설정
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.FAISS_API_URL = 'http://localhost:8000';

// 테스트 종료 후 정리
afterAll(async () => {
    // 필요한 정리 작업 수행
}); 