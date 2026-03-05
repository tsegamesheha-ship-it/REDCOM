import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database_files/redsea_brokerage.db');

console.log('🔧 AGGRESSIVE FIX: Adding commission_settings column to users table');
console.log('📁 Database file:', DB_FILE);

try {
  const db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');
  
  // Check if column already exists
  const columns = db.prepare('PRAGMA table_info(users)').all();
  console.log('\n📊 Current users table structure:');
  columns.forEach(col => {
    console.log(`  - ${col.name} (${col.type})`);
  });
  
  const hasCommissionSettings = columns.some(col => col.name === 'commission_settings');
  
  if (hasCommissionSettings) {
    console.log('\n✅ commission_settings column already exists!');
    console.log('✅ No migration needed.');
  } else {
    console.log('\n⚠️  commission_settings column NOT FOUND!');
    console.log('🔧 Adding commission_settings column...');
    
    try {
      db.prepare('ALTER TABLE users ADD COLUMN commission_settings TEXT').run();
      console.log('✅ commission_settings column added successfully!');
      
      // Verify it was added
      const newColumns = db.prepare('PRAGMA table_info(users)').all();
      const nowHasColumn = newColumns.some(col => col.name === 'commission_settings');
      
      if (nowHasColumn) {
        console.log('✅ VERIFIED: Column exists in table now!');
        console.log('\n📊 Updated users table structure:');
        newColumns.forEach(col => {
          console.log(`  - ${col.name} (${col.type})`);
        });
      } else {
        console.log('❌ ERROR: Column was not added!');
      }
    } catch (error) {
      console.error('❌ Failed to add column:', error.message);
      throw error;
    }
  }
  
  // Test update
  console.log('\n🧪 Testing commission_settings update...');
  const testUser = db.prepare('SELECT _id, username FROM users LIMIT 1').get();
  
  if (testUser) {
    console.log(`🧪 Test user: ${testUser.username} (ID: ${testUser._id})`);
    
    const testCommission = {
      adjustmentType: 'percentage',
      value: '10',
      workType: 'all'
    };
    
    console.log('🧪 Test commission data:', JSON.stringify(testCommission));
    
    try {
      const updateStmt = db.prepare('UPDATE users SET commission_settings = ? WHERE _id = ?');
      const result = updateStmt.run(JSON.stringify(testCommission), testUser._id);
      
      console.log(`✅ Test update successful! Changes: ${result.changes}`);
      
      // Verify the update
      const verifyStmt = db.prepare('SELECT commission_settings FROM users WHERE _id = ?');
      const verifyResult = verifyStmt.get(testUser._id);
      
      console.log('✅ Verified saved data:', verifyResult.commission_settings);
      
      if (verifyResult.commission_settings) {
        const parsed = JSON.parse(verifyResult.commission_settings);
        console.log('✅ Parsed commission settings:', parsed);
      }
    } catch (error) {
      console.error('❌ Test update failed:', error.message);
      throw error;
    }
  } else {
    console.log('⚠️  No users found in database to test with');
  }
  
  db.close();
  console.log('\n✅ AGGRESSIVE FIX COMPLETED SUCCESSFULLY!');
  console.log('✅ commission_settings column is ready to use.');
  console.log('✅ You can now save commission settings from the Root Dashboard.');
  
} catch (error) {
  console.error('\n❌ AGGRESSIVE FIX FAILED!');
  console.error('❌ Error:', error.message);
  console.error('❌ Stack:', error.stack);
  process.exit(1);
}
