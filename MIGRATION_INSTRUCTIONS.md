# 마이그레이션 실행 안내

Prisma 스키마에 `address` 필드가 추가되었습니다. 다음 명령어를 실행하세요:

```bash
cd KITAE-project-1-backend
npx prisma migrate dev --name add_user_address_field
```

그 다음 Prisma Client를 재생성하세요:

```bash
npx prisma generate
```

백엔드 서버를 재시작하세요:

```bash
npm run dev
```

## 변경 사항 요약:

### CheckoutPage (완료)
- ✅ 주문 생성 API 연결
- ✅ 장바구니에서 주문으로 전환
- ✅ 성공 시 MyPage로 리다이렉트

### MyPage (완료)
- ✅ 주문 목록 API 연결
- ✅ 사용자 정보 업데이트 API 연결
- ✅ `address` 필드 스키마 추가

### 백엔드 (완료)
- ✅ Order 컨트롤러에 디버깅 로그 추가
- ✅ User 컨트롤러에 디버깅 로그 추가
- ✅ User Service에서 `address` 필드 처리
- ✅ Prisma 스키마에 `address` Json 필드 추가

