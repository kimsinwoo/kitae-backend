# PowerShell 스크립트: 데이터베이스 백업
# 사용법: .\scripts\backup-database.ps1

# .env 파일에서 DATABASE_URL 읽기
$envFile = Join-Path $PSScriptRoot "..\.env"
if (-not (Test-Path $envFile)) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    exit 1
}

# DATABASE_URL 파싱
$envContent = Get-Content $envFile | Where-Object { $_ -match '^DATABASE_URL=' }
if (-not $envContent) {
    Write-Host "❌ DATABASE_URL not found in .env file!" -ForegroundColor Red
    exit 1
}

$databaseUrl = ($envContent -split '=')[1].Trim('"')
$match = $databaseUrl -match 'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)'

if (-not $match) {
    Write-Host "❌ Invalid DATABASE_URL format!" -ForegroundColor Red
    exit 1
}

$user = $matches[1]
$password = $matches[2]
$host = $matches[3]
$port = $matches[4]
$database = $matches[5]

Write-Host "📦 Starting database backup..." -ForegroundColor Cyan
Write-Host "Database: $database" -ForegroundColor Yellow
Write-Host "Host: ${host}:${port}" -ForegroundColor Yellow

# 백업 디렉토리 생성
$backupDir = Join-Path $PSScriptRoot "..\backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# 백업 파일명 생성
$timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$backupFile = Join-Path $backupDir "kitae_db_backup_$timestamp.sql"

Write-Host "🔄 Creating backup file..." -ForegroundColor Cyan

# mysqldump 실행
$mysqldumpPath = "mysqldump"
try {
    & $mysqldumpPath -h $host -P $port -u $user "-p$password" $database | Out-File -FilePath $backupFile -Encoding UTF8
    
    if (Test-Path $backupFile) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Host "✅ Backup completed successfully!" -ForegroundColor Green
        Write-Host "📁 Backup file: $backupFile" -ForegroundColor Green
        Write-Host "📊 File size: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 To restore this backup on another computer:" -ForegroundColor Cyan
        Write-Host "   1. Copy the file: $backupFile" -ForegroundColor Yellow
        Write-Host "   2. Run: node scripts/restore-database.js <backup-file-path>" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Backup file was not created!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Backup failed: $_" -ForegroundColor Red
    exit 1
}

