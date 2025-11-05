# KITAE Backend Setup Guide (MySQL 버전)

## 1. 환경 설정

### 1.1 MySQL 데이터베이스 생성

MySQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE kitae_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 1.2 .env 파일 생성

백엔드 폴더에 `.env` 파일을 생성하세요:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MySQL)
DATABASE_URL="mysql://사용자명:비밀번호@localhost:3306/kitae_db"

# JWT
JWT_SECRET=kitae-super-secret-key-2024-change-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

# Admin
ADMIN_EMAIL=admin@kitae.com
ADMIN_PASSWORD=admin123456
```

**중요**: `DATABASE_URL`은 실제 MySQL 정보로 변경하세요.

### 1.3 의존성 설치

```bash
npm install
```

### 1.4 Prisma 설정

```bash
# Prisma Client 생성
npm run prisma:generate

# 데이터베이스 마이그레이션
npm run prisma:migrate dev --name init
```

마이그레이션 중 데이터베이스 이름을 입력하라고 하면 `kitae_db` 입력

### 1.5 서버 실행

```bash
npm run dev
```

서버가 성공적으로 시작되면 다음과 같은 메시지가 표시됩니다:
```
✅ Database connected successfully
🚀 KITAE Backend Server running on port 5000
```

## 2. 테스트

### 2.1 Health Check
브라우저에서 접속:
```
http://localhost:5000/health
```

예상 응답:
```json
{"status":"OK","message":"KITAE Backend is running"}
```

### 2.2 API 테스트 (Postman 또는 curl 사용)

**회원가입:**
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test1234",
  "name": "Test User"
}
```

**로그인:**
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test1234"
}
```

## 3. 문제 해결

### 데이터베이스 연결 오류
- MySQL이 실행 중인지 확인: `mysql --version`
- 데이터베이스가 생성되었는지 확인
- `DATABASE_URL` 형식이 올바른지 확인: `mysql://user:pass@host:port/dbname`

### 포트 충돌
- `PORT` 환경 변수를 다른 값(예: 5001)으로 변경

### Prisma 오류
- `npm run prisma:generate` 다시 실행
- `node_modules` 삭제 후 `npm install` 다시 실행

### 마이그레이션 오류
- 데이터베이스에 테이블이 이미 있는 경우:
  ```bash
  npx prisma migrate reset  # 주의: 모든 데이터 삭제됨
  npm run prisma:migrate dev --name init
  ```

## 4. 초기 데이터 추가

Prisma Studio를 사용하여 데이터를 추가할 수 있습니다:

```bash
npm run prisma:studio
```

브라우저에서 http://localhost:5555 접속하여 GUI로 데이터 관리

## 5. 다음 단계

1. 프론트엔드에서 API 연결
2. 관리자 계정 생성
3. 상품 데이터 추가
4. 이미지 업로드 기능 구현
