import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database_files/redsea_brokerage.db');

try {
  console.log('🔧 Verifying and fixing commission_settings column...');
  console.log('📁 Database file:', DB_FILE);
  
  const db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  
  // Get current table structure
  console.log('\n📊 Current users table structure:');
  const columns = db.prepare('PRAGMA table_info(users)').all();
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  // Check if column exists
  const hasCommissionSettings = columns.some(col => col.name === 'commission_settings');
  
  if (hasCommissionSettings) {
    console.log('\n✅ commission_settings column already exists');
    
    // Test if we can update it
    console.log('\n🧪 Testing column update...');
    try {
      const testUpdate = db.prepare('UPDATE users SET commission_settings = ? WHERE _id = 999999').run(JSON.stringify({test: true}));
      console.log('✅ Column is writable');
    } catch (err) {
      console.error('❌ Column exists but cannot be updated:', err.message);
    }
  } else {
    console.log('\n⚠️  commission_settings column does NOT exist, adding it now...');
    
    try {
      db.prepare('ALTER TABLE users ADD COLUMN commission_settings TEXT').run();
      console.log('✅ commission_settings column added successfully');
      
      // Verify it was added
      const newColumns = db.prepare('PRAGMA table_info(users)').all();
      const nowHasColumn = newColumns.some(col => col.name === 'commission_settings');
      
      if (nowHasColumn) {
        console.log('✅ Verified: Column was added successfully');
      } else {
        console.error('❌ ERROR: Column was not added!');
      }
    } catch (err) {
      console.error('❌ Failed to add column:', err.message);
    }
  }
  
  // Show a sample user to verify
  console.log('\n👤 Sample user data:');
  const sampleUser = db.prepare('SELECT _id, username, commission_settings FROM users LIMIT 1').get();
  if (sampleUser) {
    console.log('  ID:', sampleUser._id);
    console.log('  Username:', sampleUser.username);
    console.log('  Commission Settings:', sampleUser.commission_settings || '(null)');
  } else {
    console.log('  No users in database');
  }
  
  db.close();
  console.log('\n✅ Database verification completed');
  console.log('\n⚠️  IMPORTANT: Restart the backend server for changes to take effect!');
} catch (error) {
  console.error('❌ Verification failed:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}
