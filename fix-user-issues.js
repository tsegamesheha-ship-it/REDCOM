import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database_files/redsea_brokerage.db');

async function fixUserIssues() {
  try {
    console.log('🔧 Fixing user issues...\n');
    console.log('═'.repeat(60));
    
    const db = new Database(DB_FILE);
    
    // Fix 1: Remove trailing space from TSEGAW username
    console.log('\n1️⃣ Fixing TSEGAW username (removing trailing space)...');
    const tsegawUser = db.prepare('SELECT _id, username FROM users WHERE username LIKE ?').get('TSEGAW%');
    
    if (tsegawUser) {
      console.log(`   Found: "${tsegawUser.username}" (length: ${tsegawUser.username.length})`);
      db.prepare('UPDATE users SET username = ? WHERE _id = ?').run('TSEGAW', tsegawUser._id);
      console.log('   ✅ Fixed to: "TSEGAW"');
    } else {
      console.log('   ℹ️ TSEGAW user not found or already fixed');
    }
    
    // Fix 2: Reset testuser password to test123
    console.log('\n2️⃣ Resetting testuser password to test123...');
    const testPassword = await bcrypt.hash('test123', 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE username = ?').run(testPassword, 'testuser');
    console.log('   ✅ testuser password reset to: test123');
    
    db.close();
    
    console.log('\n' + '═'.repeat(60));
    console.log('\n✅ All issues fixed!');
    console.log('\n📝 Login credentials:');
    console.log('   • Most users: username + redsea@2024');
    console.log('   • testuser: testuser + test123');
    console.log('   • TSEGAW: TSEGAW + redsea@2024 (no trailing space)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixUserIssues();
