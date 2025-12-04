const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// DATABASE_URL에서 정보 추출
// 형식: mysql://user:password@host:port/database
function parseDatabaseUrl(url) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    throw new Error('Invalid DATABASE_URL format');
  }
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: match[4],
    database: match[5]
  };
}

async function backupDatabase() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set in .env file');
    }

    const dbInfo = parseDatabaseUrl(databaseUrl);
    console.log('📦 Starting database backup...');
    console.log(`Database: ${dbInfo.database}`);
    console.log(`Host: ${dbInfo.host}:${dbInfo.port}`);

    // 백업 파일명 생성 (날짜/시간 포함)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const backupDir = path.join(__dirname, '..', 'backups');
    const backupFile = path.join(backupDir, `kitae_db_backup_${timestamp}.sql`);

    // backups 디렉토리 생성
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // mysqldump 명령어 생성
    const mysqldumpCmd = `mysqldump -h ${dbInfo.host} -P ${dbInfo.port} -u ${dbInfo.user} -p${dbInfo.password} ${dbInfo.database} > "${backupFile}"`;

    console.log('🔄 Creating backup file...');
    
    return new Promise((resolve, reject) => {
      exec(mysqldumpCmd, (error, stdout, stderr) => {
        if (error) {
          // mysqldump는 stderr에 경고를 출력하지만 성공할 수도 있음
          if (error.code === 1 && stderr.includes('mysqldump: [Warning]')) {
            console.log('⚠️ Warning:', stderr);
          } else {
            console.error('❌ Backup failed:', error.message);
            console.error('stderr:', stderr);
            reject(error);
            return;
          }
        }

        // 파일이 생성되었는지 확인
        if (fs.existsSync(backupFile)) {
          const stats = fs.statSync(backupFile);
          const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
          console.log(`✅ Backup completed successfully!`);
          console.log(`📁 Backup file: ${backupFile}`);
          console.log(`📊 File size: ${fileSizeMB} MB`);
          resolve(backupFile);
        } else {
          reject(new Error('Backup file was not created'));
        }
      });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// 스크립트 실행
if (require.main === module) {
  backupDatabase()
    .then((backupFile) => {
      console.log('\n✅ Backup process completed!');
      console.log(`\n📋 To restore this backup on another computer:`);
      console.log(`   1. Copy the file: ${backupFile}`);
      console.log(`   2. Run: node scripts/restore-database.js <backup-file-path>`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Backup failed:', error.message);
      process.exit(1);
    });
}

module.exports = { backupDatabase };

