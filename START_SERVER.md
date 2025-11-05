# 백엔드 서버 실행 가이드

## 문제: ERR_CONNECTION_REFUSED
프론트엔드에서 `ERR_CONNECTION_REFUSED` 에러가 발생하는 이유는 백엔드 서버가 실행되지 않았기 때문입니다.

## 해결 방법

### 1. 백엔드 디렉토리로 이동
```bash
cd KITAE-project-1-backend
```

### 2. express-session 설치 확인 및 설치
```bash
npm install express-session
```

### 3. .env 파일 확인
`.env` 파일이 존재하고 다음 변수들이 설정되어 있는지 확인:
- `DATABASE_URL`: MySQL 데이터베이스 연결 문자열
- `SESSION_SECRET` 또는 `JWT_SECRET`: 세션 암호화 키

### 4. 서버 실행

**개발 모드 (nodemon 사용 - 파일 변경 시 자동 재시작):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

### 5. 서버가 정상적으로 시작되면:
- 콘솔에 `🚀 KITAE Backend Server running on port 5000` 메시지가 표시됩니다
- `http://localhost:5000/health` 접속 시 `{"status":"OK","message":"KITAE Backend is running"}` 응답 확인

### 6. 프론트엔드 확인
백엔드가 실행되면 프론트엔드에서 API 요청이 정상적으로 작동합니다.

## 문제 해결 체크리스트

- [ ] `express-session` 패키지 설치 확인
- [ ] `.env` 파일 존재 및 변수 설정 확인
- [ ] MySQL 데이터베이스 연결 확인
- [ ] 포트 5000이 다른 프로세스에 의해 사용되지 않는지 확인
- [ ] CORS 설정에서 프론트엔드 포트(5173)가 허용 목록에 있는지 확인

