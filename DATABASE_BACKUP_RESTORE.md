# 데이터베이스 백업 및 복원 가이드

이 가이드는 로컬 데이터베이스의 데이터를 다른 컴퓨터로 옮기는 방법을 설명합니다.

## 📋 목차
1. [백업 (현재 컴퓨터)](#백업-현재-컴퓨터)
2. [복원 (다른 컴퓨터)](#복원-다른-컴퓨터)
3. [자동화 스크립트 사용법](#자동화-스크립트-사용법)

---

## 백업 (현재 컴퓨터)

### 방법 1: Node.js 스크립트 사용 (권장)

```bash
cd kitae-backend
node scripts/backup-database.js
```

백업 파일은 `kitae-backend/backups/` 디렉토리에 생성됩니다.
파일명 형식: `kitae_db_backup_YYYY-MM-DDTHH-mm-ss.sql`

### 방법 2: PowerShell 스크립트 사용 (Windows)

```powershell
cd kitae-backend
.\scripts\backup-database.ps1
```

### 방법 3: 수동 백업 (mysqldump 직접 사용)

```bash
# .env 파일에서 DATABASE_URL 확인 후
mysqldump -h localhost -P 3306 -u root -p비밀번호 kitae_db > backup.sql
```

---

## 복원 (다른 컴퓨터)

### 사전 준비

1. **MySQL 설치 확인**
   - 다른 컴퓨터에 MySQL이 설치되어 있어야 합니다.
   - MySQL이 설치되어 있지 않다면 [MySQL 공식 사이트](https://dev.mysql.com/downloads/mysql/)에서 다운로드하세요.

2. **프로젝트 설정**
   ```bash
   # 프로젝트 클론 또는 복사
   cd kitae-backend
   
   # 의존성 설치
   npm install
   
   # .env 파일 생성 및 DATABASE_URL 설정
   # DATABASE_URL="mysql://사용자명:비밀번호@localhost:3306/kitae_db"
   ```

3. **데이터베이스 생성**
   ```sql
   CREATE DATABASE kitae_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 복원 실행

#### 0단계: 백업 파일 업로드 (중요!)

**Windows에서 Ubuntu 서버로 파일 업로드:**

```bash
# 방법 1: SCP 사용 (PowerShell 또는 CMD)
scp backups/kitae_db_backup_2025-12-04T12-36-19.sql ubuntu@서버IP:~/kitae-backend/

# 방법 2: SFTP 사용 (FileZilla, WinSCP 등)
# 호스트: 서버IP
# 사용자명: ubuntu
# 프로토콜: SFTP
# 포트: 22
# 업로드 경로: ~/kitae-backend/ 또는 ~/kitae-backend/backups/
```

**서버에서 백업 파일 확인:**
```bash
cd ~/kitae-backend

# 사용 가능한 백업 파일 목록 확인
npm run db:list
# 또는
node scripts/list-backups.js
```

#### 방법 1: Node.js 스크립트 사용 (권장)

```bash
cd kitae-backend

# 백업 파일을 프로젝트에 복사한 후
node scripts/restore-database.js backups/kitae_db_backup_YYYY-MM-DDTHH-mm-ss.sql

# 또는 절대 경로 사용
node scripts/restore-database.js "/home/ubuntu/kitae-backend/backups/kitae_db_backup_YYYY-MM-DDTHH-mm-ss.sql"

# 또는 현재 디렉토리에 파일이 있는 경우
node scripts/restore-database.js kitae_db_backup_YYYY-MM-DDTHH-mm-ss.sql
```

#### 방법 2: 수동 복원 (mysql 직접 사용)

```bash
# .env 파일에서 DATABASE_URL 확인 후
mysql -h localhost -P 3306 -u root -p비밀번호 kitae_db < backup.sql
```

### 복원 후 작업

```bash
# Prisma Client 재생성
npm run prisma:generate

# 서버 실행
npm run dev
```

---

## 자동화 스크립트 사용법

### 백업 스크립트 (`scripts/backup-database.js`)

**기능:**
- `.env` 파일에서 `DATABASE_URL` 자동 읽기
- 날짜/시간이 포함된 백업 파일 자동 생성
- `backups/` 디렉토리에 저장

**사용법:**
```bash
node scripts/backup-database.js
```

**출력 예시:**
```
📦 Starting database backup...
Database: kitae_db
Host: localhost:3306
🔄 Creating backup file...
✅ Backup completed successfully!
📁 Backup file: C:\ksw\kitae-backend\backups\kitae_db_backup_2024-01-15T14-30-00.sql
📊 File size: 2.45 MB
```

### 복원 스크립트 (`scripts/restore-database.js`)

**기능:**
- 백업 파일에서 데이터베이스 자동 복원
- 데이터베이스가 없으면 자동 생성
- `.env` 파일의 `DATABASE_URL` 사용
- 여러 위치에서 백업 파일 자동 검색
- 사용 가능한 백업 파일 목록 표시

**사용법:**
```bash
node scripts/restore-database.js <백업파일경로>
```

**예시:**
```bash
# 상대 경로
node scripts/restore-database.js backups/kitae_db_backup_2024-01-15T14-30-00.sql

# 절대 경로 (Windows)
node scripts/restore-database.js "C:\Users\username\Downloads\kitae_db_backup_2024-01-15T14-30-00.sql"

# 절대 경로 (Linux/Ubuntu)
node scripts/restore-database.js "/home/ubuntu/kitae-backend/backups/kitae_db_backup_2024-01-15T14-30-00.sql"

# 현재 디렉토리의 파일
node scripts/restore-database.js kitae_db_backup_2024-01-15T14-30-00.sql
```

**파일을 찾을 수 없는 경우:**
스크립트가 자동으로 다음 위치에서 파일을 검색합니다:
- 지정된 경로
- 현재 디렉토리
- `backups/` 디렉토리
- 상위 디렉토리

파일을 찾을 수 없으면 사용 가능한 `.sql` 파일 목록을 표시합니다.

### 백업 파일 목록 스크립트 (`scripts/list-backups.js`)

**기능:**
- 시스템에서 사용 가능한 백업 파일 검색 및 표시
- 파일 크기 및 수정 날짜 정보 제공

**사용법:**
```bash
npm run db:list
# 또는
node scripts/list-backups.js
```

**출력 예시:**
```
🔍 Searching for backup files...

📁 /home/ubuntu/kitae-backend/backups:
   ✅ kitae_db_backup_2025-12-04T12-36-19.sql
      Size: 0.02 MB | Modified: 2025-12-04 12:36:19
      Path: /home/ubuntu/kitae-backend/backups/kitae_db_backup_2025-12-04T12-36-19.sql

✅ Found 1 backup file(s)

💡 To restore, use:
   node scripts/restore-database.js "backups/kitae_db_backup_2025-12-04T12-36-19.sql"
```

**출력 예시:**
```
📦 Starting database restore...
Database: kitae_db
Host: localhost:3306
Backup file: C:\ksw\kitae-backend\backups\kitae_db_backup_2024-01-15T14-30-00.sql
🔄 Checking database...
🔄 Restoring database from backup...
✅ Database restored successfully!

📋 Next steps:
   1. Run: npm run prisma:generate
   2. Run: npm run dev
```

---

## 🔧 문제 해결

### 백업 실패 시

1. **MySQL 경로 확인**
   ```bash
   # Windows
   where mysqldump
   
   # macOS/Linux
   which mysqldump
   ```

2. **MySQL이 PATH에 없는 경우**
   - Windows: MySQL 설치 경로를 환경 변수 PATH에 추가
   - 일반 경로: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

3. **권한 문제**
   - MySQL 사용자에게 백업 권한이 있는지 확인
   - 관리자 권한으로 실행 시도

### 복원 실패 시

1. **데이터베이스가 이미 존재하는 경우**
   ```sql
   -- 기존 데이터베이스 삭제 후 재생성
   DROP DATABASE IF EXISTS kitae_db;
   CREATE DATABASE kitae_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **문자 인코딩 문제**
   - 백업 파일이 UTF-8로 저장되었는지 확인
   - MySQL 설정에서 `utf8mb4` 사용 확인

3. **외래 키 제약 조건**
   - 복원 시 외래 키 체크 비활성화:
   ```sql
   SET FOREIGN_KEY_CHECKS = 0;
   -- 복원 작업
   SET FOREIGN_KEY_CHECKS = 1;
   ```

---

## 📝 주의사항

1. **비밀번호 보안**
   - 백업 파일에는 데이터베이스 비밀번호가 포함되지 않습니다.
   - `.env` 파일은 절대 공유하지 마세요.

2. **파일 크기**
   - 대용량 데이터베이스의 경우 백업 파일이 클 수 있습니다.
   - 압축하여 전송하는 것을 권장합니다.

3. **버전 호환성**
   - MySQL 버전이 다를 경우 호환성 문제가 발생할 수 있습니다.
   - 가능하면 동일한 MySQL 버전 사용을 권장합니다.

4. **백업 파일 관리**
   - `backups/` 디렉토리는 `.gitignore`에 추가하는 것을 권장합니다.
   - 민감한 데이터가 포함될 수 있으므로 안전하게 보관하세요.

---

## 📦 전체 프로세스 요약

### 현재 컴퓨터 (백업)
```bash
cd kitae-backend
node scripts/backup-database.js
# 백업 파일을 USB나 클라우드에 복사
```

### 다른 컴퓨터 (복원)
```bash
# 1. 프로젝트 설정
cd kitae-backend
npm install

# 2. .env 파일 생성 및 DATABASE_URL 설정
# DATABASE_URL="mysql://사용자명:비밀번호@localhost:3306/kitae_db"

# 3. 데이터베이스 생성
mysql -u root -p
CREATE DATABASE kitae_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 4. 백업 파일 복원
node scripts/restore-database.js backups/kitae_db_backup_YYYY-MM-DDTHH-mm-ss.sql

# 5. Prisma Client 재생성 및 서버 실행
npm run prisma:generate
npm run dev
```

---

## 🎯 빠른 참조

| 작업 | 명령어 |
|------|--------|
| 백업 | `npm run db:backup` 또는 `node scripts/backup-database.js` |
| 백업 파일 목록 | `npm run db:list` 또는 `node scripts/list-backups.js` |
| 복원 | `npm run db:restore <파일경로>` 또는 `node scripts/restore-database.js <파일경로>` |
| Prisma 재생성 | `npm run prisma:generate` |
| 서버 실행 | `npm run dev` |

