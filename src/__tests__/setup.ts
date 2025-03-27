import dotenv from 'dotenv';
import path from 'path';

// 테스트용 환경 변수 로드
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// 전역 타임아웃 설정
jest.setTimeout(30000);

// 전역 모의 설정
beforeAll(async () => {
    // 필요한 전역 설정
    process.env.NODE_ENV = 'test';
});

afterAll(async () => {
    // 정리 작업
}); 