# Last News Finder

뉴스 검색 서비스 - 벡터 유사도 검색을 통한 관련 뉴스 찾기

## 기능

- Airtable을 통한 뉴스 데이터 관리
- Solar API를 사용한 텍스트 벡터화
- FAISS를 활용한 벡터 유사도 검색
- Redis를 통한 캐싱 시스템
- Google Apps Script를 통한 자동 인덱스 업데이트

## 기술 스택

- TypeScript
- Node.js
- Express
- Airtable
- Solar API
- FAISS
- Redis
- Google Apps Script

## 설치 방법

1. 저장소 클론
```bash
git clone https://github.com/yourusername/last-news-finder.git
cd last-news-finder
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
```
`.env` 파일을 열고 필요한 API 키와 설정을 입력하세요.

4. 개발 서버 실행
```bash
npm run dev
```

## 환경 변수

- `AIRTABLE_API_KEY`: Airtable API 키
- `AIRTABLE_BASE_ID`: Airtable Base ID
- `AIRTABLE_TABLE_NAME`: Airtable 테이블 이름
- `SOLAR_API_KEY`: Solar API 키
- `SOLAR_API_URL`: Solar API URL
- `PORT`: 서버 포트 (기본값: 3000)
- `NODE_ENV`: 환경 설정 (development/production)

## API 엔드포인트

- `GET /api/articles`: 기사 목록 조회
- `GET /api/articles/:id`: 특정 기사 조회
- `POST /api/search`: 뉴스 검색
- `GET /api/companies`: 기업 목록 조회

## 테스트

```bash
# 단위 테스트 실행
npm test

# 통합 테스트 실행
npm run test:integration
```

## 라이선스

ISC
