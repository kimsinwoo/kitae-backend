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

    let resolvedPath = path.isAbsolute(backupFilePath) 
      ? backupFilePath 
      : path.resolve(process.cwd(), backupFilePath);

    // 파일이 존재하지 않으면 여러 경로에서 찾기 시도
    if (!fs.existsSync(resolvedPath)) {
      console.log(`⚠️ File not found at: ${resolvedPath}`);
      console.log('🔍 Searching for backup file in common locations...');
      
      // 현재 디렉토리에서 직접 찾기
      const currentDirFile = path.resolve(process.cwd(), path.basename(backupFilePath));
      if (fs.existsSync(currentDirFile)) {
        console.log(`✅ Found file in current directory: ${currentDirFile}`);
        resolvedPath = currentDirFile;
      } else {
        // backups 디렉토리에서 찾기
        const backupsDir = path.join(process.cwd(), 'backups');
        const backupsFile = path.join(backupsDir, path.basename(backupFilePath));
        if (fs.existsSync(backupsFile)) {
          console.log(`✅ Found file in backups directory: ${backupsFile}`);
          resolvedPath = backupsFile;
        } else {
          // 상위 디렉토리에서 찾기
          const parentDirFile = path.resolve(process.cwd(), '..', path.basename(backupFilePath));
          if (fs.existsSync(parentDirFile)) {
            console.log(`✅ Found file in parent directory: ${parentDirFile}`);
            resolvedPath = parentDirFile;
          } else {
            // 현재 디렉토리의 모든 .sql 파일 나열
            console.log('\n📋 Available .sql files in current directory:');
            try {
              const files = fs.readdirSync(process.cwd());
              const sqlFiles = files.filter(f => f.endsWith('.sql'));
              if (sqlFiles.length > 0) {
                sqlFiles.forEach(f => console.log(`   - ${f}`));
              } else {
                console.log('   (no .sql files found)');
              }
            } catch (e) {
              // ignore
            }
            
            // backups 디렉토리의 파일 나열
            if (fs.existsSync(backupsDir)) {
              console.log('\n📋 Available .sql files in backups directory:');
              try {
                const files = fs.readdirSync(backupsDir);
                const sqlFiles = files.filter(f => f.endsWith('.sql'));
                if (sqlFiles.length > 0) {
                  sqlFiles.forEach(f => console.log(`   - ${f}`));
                } else {
                  console.log('   (no .sql files found)');
                }
              } catch (e) {
                // ignore
              }
            }
            
            throw new Error(
              `Backup file not found: ${resolvedPath}\n\n` +
              `Please ensure:\n` +
              `1. The backup file exists at the specified path\n` +
              `2. You have uploaded the backup file to the server\n` +
              `3. The file path is correct\n\n` +
              `You can upload the file using:\n` +
              `  - SCP: scp backup.sql user@server:/path/to/kitae-backend/\n` +
              `  - SFTP: Use FileZilla or similar tool\n` +
              `  - Or place it in the current directory or backups/ directory`
            );
          }
        }
      }
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

