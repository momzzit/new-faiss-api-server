FROM node:18-alpine

WORKDIR /app

# 의존성 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 컴파일
RUN npm run build

# 개발 의존성 제거
RUN npm prune --production

# 환경 변수 설정
ENV NODE_ENV=production

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"] 