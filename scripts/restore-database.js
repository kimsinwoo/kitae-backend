const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// DATABASE_URL에서 정보 추출
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

async function restoreDatabase(backupFilePath) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not set in .env file');
    }

    // 백업 파일 경로 확인
    if (!backupFilePath) {
      throw new Error('Backup file path is required');
    }

    const resolvedPath = path.isAbsolute(backupFilePath) 
      ? backupFilePath 
      : path.resolve(process.cwd(), backupFilePath);

    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Backup file not found: ${resolvedPath}`);
    }

    const dbInfo = parseDatabaseUrl(databaseUrl);
    console.log('📦 Starting database restore...');
    console.log(`Database: ${dbInfo.database}`);
    console.log(`Host: ${dbInfo.host}:${dbInfo.port}`);
    console.log(`Backup file: ${resolvedPath}`);

    // 데이터베이스가 존재하는지 확인하고 없으면 생성
    console.log('🔄 Checking database...');
    const createDbCmd = `mysql -h ${dbInfo.host} -P ${dbInfo.port} -u ${dbInfo.user} -p${dbInfo.password} -e "CREATE DATABASE IF NOT EXISTS ${dbInfo.database} DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`;
    
    await new Promise((resolve, reject) => {
      exec(createDbCmd, (error, stdout, stderr) => {
        if (error && !error.message.includes('already exists')) {
          console.error('❌ Failed to create database:', error.message);
          reject(error);
          return;
        }
        resolve();
      });
    });

    // 데이터베이스 복원
    console.log('🔄 Restoring database from backup...');
    const restoreCmd = `mysql -h ${dbInfo.host} -P ${dbInfo.port} -u ${dbInfo.user} -p${dbInfo.password} ${dbInfo.database} < "${resolvedPath}"`;

    return new Promise((resolve, reject) => {
      exec(restoreCmd, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Restore failed:', error.message);
          if (stderr) {
            console.error('stderr:', stderr);
          }
          reject(error);
          return;
        }

        console.log('✅ Database restored successfully!');
        console.log('\n📋 Next steps:');
        console.log('   1. Run: npm run prisma:generate');
        console.log('   2. Run: npm run dev');
        resolve();
      });
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// 스크립트 실행
if (require.main === module) {
  const backupFilePath = process.argv[2];
  
  if (!backupFilePath) {
    console.error('❌ Usage: node restore-database.js <backup-file-path>');
    console.error('\nExample:');
    console.error('  node scripts/restore-database.js backups/kitae_db_backup_2024-01-01T12-00-00.sql');
    process.exit(1);
  }

  restoreDatabase(backupFilePath)
    .then(() => {
      console.log('\n✅ Restore process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Restore failed:', error.message);
      process.exit(1);
    });
}

module.exports = { restoreDatabase };

