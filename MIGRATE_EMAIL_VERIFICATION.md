# Email Verification Migration Guide

## 필수 마이그레이션

Prisma 스키마에 `EmailVerification` 모델이 추가되었습니다. 데이터베이스 마이그레이션을 실행해야 합니다.

### 1. 마이그레이션 생성 및 적용

```bash
cd KITAE-project-1-backend
npx prisma migrate dev --name add_email_verification
```

### 2. Prisma Client 재생성

```bash
npx prisma generate
```

### 3. 백엔드 서버 재시작

마이그레이션이 완료된 후 백엔드 서버를 재시작하세요.

## 개발 환경 이메일 인증 코드 확인

개발 환경에서는 실제 이메일이 전송되지 않고, 백엔드 콘솔에 인증 코드가 출력됩니다.

콘솔에서 다음과 같은 형식으로 출력됩니다:

```
📧 ========== EMAIL VERIFICATION ==========
To: user@example.com
Type: 아이디 찾기 (또는 비밀번호 변경)
Verification Code: 123456
==========================================
```

## 프로덕션 환경 설정 (선택사항)

실제 이메일 발송을 원하는 경우, `email.service.js`의 주석 처리된 nodemailer 코드를 활성화하고 환경 변수를 설정하세요:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

