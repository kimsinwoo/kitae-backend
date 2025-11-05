# Gmail 앱 비밀번호 생성 가이드

## 현재 문제

에러 메시지: `Application-specific password required`

Gmail은 보안상의 이유로 일반 비밀번호 대신 **앱 비밀번호**를 사용해야 합니다.

## 해결 방법

### 1단계: 2단계 인증 활성화 (필수)

1. https://myaccount.google.com/ 접속
2. 좌측 메뉴에서 **"보안"** 클릭
3. **"Google에 로그인"** 섹션에서 **"2단계 인증"** 클릭
4. 2단계 인증 활성화 (휴대폰 번호 등 설정)

### 2단계: 앱 비밀번호 생성

1. Google 계정 설정 → **보안** → **2단계 인증**
2. 페이지 하단의 **"앱 비밀번호"** 클릭
3. 또는 직접 링크: https://myaccount.google.com/apppasswords

4. 앱 비밀번호 생성:
   - **앱 선택**: "메일" 선택
   - **기기 선택**: "Windows 컴퓨터" (또는 "기타" 입력)
   - **생성** 클릭

5. 생성된 16자리 비밀번호 복사
   - 형식: `xxxx xxxx xxxx xxxx` (공백 포함)
   - 공백은 제거하고 사용해도 됨

### 3단계: .env 파일 수정

`.env` 파일을 열어서 다음과 같이 수정:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password
EMAIL_SERVICE=gmail
```

**중요:**
- 일반 비밀번호가 아닌 **앱 비밀번호**를 사용하세요
- 앱 비밀번호는 16자리 영문/숫자 조합입니다

### 4단계: 서버 재시작

1. 서버 중지 (Ctrl+C)
2. 서버 재시작: `npm run dev`

### 5단계: 확인

서버 콘솔에 다음과 같은 메시지가 나타나면 성공:

```
✅ Verification email sent to email@gmail.com <message-id>
```

## 앱 비밀번호 예시

앱 비밀번호는 다음과 같은 형식입니다:
- `abcd efgh ijkl mnop` (공백 포함)
- 또는 `abcdefghijklmnop` (공백 제거)

둘 다 사용 가능합니다.

