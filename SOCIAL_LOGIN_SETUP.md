# 소셜 로그인 설정 가이드

## 구글 로그인 설정

1. **Google Cloud Console** 접속
   - https://console.cloud.google.com/

2. **프로젝트 선택 또는 생성**

3. **OAuth 2.0 클라이언트 ID 생성**
   - APIs & Services → Credentials
   - Create Credentials → OAuth client ID
   - Application type: Web application

4. **Authorized JavaScript origins 추가**
   ```
   http://localhost:3000
   http://localhost:5173
   http://localhost:5174
   https://your-production-domain.com
   ```

5. **Authorized redirect URIs 추가**
   ```
   http://localhost:3000
   http://localhost:5173
   http://localhost:5174
   https://your-production-domain.com
   ```

6. **환경 변수 설정**
   - `.env` 파일에 추가:
   ```
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
   - 프론트엔드 `.env` 또는 `.env.local`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

## 카카오 로그인 설정

1. **카카오 개발자 콘솔** 접속
   - https://developers.kakao.com/

2. **내 애플리케이션** → 애플리케이션 선택 또는 생성

3. **플랫폼 설정**
   - Web 플랫폼 등록
   - 사이트 도메인 입력:
     ```
     http://localhost:3000
     http://localhost:5173
     https://your-production-domain.com
     ```

4. **카카오 로그인 활성화**
   - 제품 설정 → 카카오 로그인
   - Redirect URI 등록:
     ```
     http://localhost:3000/oauth/kakao/callback
     http://localhost:5173/oauth/kakao/callback
     https://your-production-domain.com/oauth/kakao/callback
     ```

5. **동의 항목 설정**
   - 카카오 로그인 → 동의항목
   - 필수: 닉네임 (profile_nickname)
   - 선택: 카카오계정(이메일) (account_email)

6. **환경 변수 설정**
   - 백엔드 `.env`:
   ```
   KAKAO_REST_API_KEY=your-kakao-rest-api-key
   KAKAO_CLIENT_SECRET=your-kakao-client-secret
   KAKAO_REDIRECT_URI=http://localhost:3000/oauth/kakao/callback
   ```
   - 프론트엔드 `.env` 또는 `.env.local`:
   ```
   VITE_KAKAO_APP_KEY=your-kakao-rest-api-key
   ```

## 네이버 로그인 설정

1. **네이버 개발자 센터** 접속
   - https://developers.naver.com/

2. **애플리케이션 등록**
   - 애플리케이션 → 애플리케이션 등록
   - 서비스 환경: PC 웹
   - 서비스 URL: `http://localhost:3000` 또는 프로덕션 도메인

3. **Callback URL 등록**
   ```
   http://localhost:3000/oauth/naver/callback
   http://localhost:5173/oauth/naver/callback
   https://your-production-domain.com/oauth/naver/callback
   ```

4. **환경 변수 설정**
   - 백엔드 `.env`:
   ```
   NAVER_CLIENT_ID=your-naver-client-id
   NAVER_CLIENT_SECRET=your-naver-client-secret
   NAVER_REDIRECT_URI=http://localhost:3000/oauth/naver/callback
   ```
   - 프론트엔드 `.env` 또는 `.env.local`:
   ```
   VITE_NAVER_CLIENT_ID=your-naver-client-id
   ```

## 문제 해결

### 구글 로그인 403 에러
- Google Cloud Console에서 JavaScript origins와 redirect URIs가 정확히 설정되었는지 확인
- 도메인에 `http://` 또는 `https://` 포함해야 함
- 포트 번호 포함 (`localhost:3000`)

### 카카오 로그인 "등록되지 않은 플랫폼" 에러
- 카카오 개발자 콘솔에서 Web 플랫폼이 등록되었는지 확인
- 사이트 도메인에 정확한 URL 입력
- Redirect URI가 정확히 일치하는지 확인

### 네이버 로그인 문제
- **404 에러 (`oauth2.0/none`)**: 네이버 개발자 센터에서 Callback URL이 정확히 일치하는지 확인
- **토큰 미발급**: redirect_uri가 토큰 교환 시에도 정확히 일치해야 함
- 네이버 개발자 센터의 Callback URL과 백엔드 `.env`의 `NAVER_REDIRECT_URI`가 정확히 일치해야 함
- 예: `http://localhost:3000/oauth/naver/callback` (끝에 슬래시 없이)

### 네이버 로그인 후 사용자 정보 미표시
- 브라우저 콘솔에서 localStorage 확인
- UserContext 업데이트 확인
- 세션 쿠키가 제대로 설정되었는지 확인

