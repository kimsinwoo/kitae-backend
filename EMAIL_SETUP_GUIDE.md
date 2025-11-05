# 이메일 발송 설정 가이드

## Gmail 사용하기 (권장)

### 1. Google 앱 비밀번호 생성

1. Google 계정 설정으로 이동: https://myaccount.google.com/
2. 보안 → 2단계 인증 활성화 (필수)
3. 앱 비밀번호 생성:
   - Google 계정 → 보안 → 2단계 인증 → 앱 비밀번호
   - "앱 선택" → "메일"
   - "기기 선택" → "Windows 컴퓨터" (또는 기타)
   - 생성된 16자리 비밀번호 복사

### 2. .env 파일 설정

`.env` 파일에 다음을 추가하세요:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
EMAIL_SERVICE=gmail
```

### 3. 서버 재시작

```bash
npm run dev
```

## 다른 이메일 서비스 사용하기

### Naver 메일

```env
EMAIL_HOST=smtp.naver.com
EMAIL_PORT=587
EMAIL_USER=your-email@naver.com
EMAIL_PASSWORD=your-password
```

### Outlook/Hotmail

```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### 기타 SMTP 서버

```env
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

## 테스트

1. `.env` 파일에 이메일 설정 추가
2. 백엔드 서버 재시작
3. 비밀번호 변경 페이지에서 이메일 입력
4. 실제 이메일 수신 확인

## 문제 해결

### 이메일이 발송되지 않는 경우

1. 환경 변수가 제대로 설정되었는지 확인
2. Gmail 사용 시 앱 비밀번호 사용 확인 (일반 비밀번호 X)
3. 방화벽이 포트 587을 막지 않는지 확인
4. 서버 콘솔 로그 확인

### 이메일 설정이 없는 경우

환경 변수가 설정되지 않으면 콘솔에 인증 코드가 출력됩니다 (개발용).

