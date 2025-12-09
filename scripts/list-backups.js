const fs = require('fs');
const path = require('path');

function listBackupFiles() {
  console.log('🔍 Searching for backup files...\n');
  
  const searchPaths = [
    path.join(process.cwd(), 'backups'),
    process.cwd(),
    path.join(process.cwd(), '..'),
  ];
  
  const foundFiles = [];
  
  searchPaths.forEach(searchPath => {
    try {
      if (fs.existsSync(searchPath)) {
        const files = fs.readdirSync(searchPath);
        const sqlFiles = files.filter(f => f.endsWith('.sql'));
        
        if (sqlFiles.length > 0) {
          console.log(`📁 ${searchPath}:`);
          sqlFiles.forEach(file => {
            const fullPath = path.join(searchPath, file);
            const stats = fs.statSync(fullPath);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            const modified = stats.mtime.toISOString().slice(0, 19).replace('T', ' ');
            console.log(`   ✅ ${file}`);
            console.log(`      Size: ${sizeMB} MB | Modified: ${modified}`);
            console.log(`      Path: ${fullPath}\n`);
            foundFiles.push(fullPath);
          });
        }
      }
    } catch (error) {
      // ignore errors
    }
  });
  
  if (foundFiles.length === 0) {
    console.log('❌ No backup files found in common locations.');
    console.log('\n💡 To restore a backup:');
    console.log('   1. Upload your backup file to the server');
    console.log('   2. Place it in the current directory or backups/ directory');
    console.log('   3. Run: node scripts/restore-database.js <file-path>\n');
  } else {
    console.log(`\n✅ Found ${foundFiles.length} backup file(s)`);
    console.log('\n💡 To restore, use:');
    foundFiles.forEach((file, index) => {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   node scripts/restore-database.js "${relativePath}"`);
    });
  }
}

if (require.main === module) {
  listBackupFiles();
}

module.exports = { listBackupFiles };


