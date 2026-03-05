import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database_files/redsea_brokerage.db');

async function createTestUser() {
  try {
    console.log('🔧 Creating test user...');
    console.log('📁 Database:', DB_FILE);
    
    const db = new Database(DB_FILE);
    db.pragma('journal_mode = WAL');
    
    // Check existing users
    const existingUsers = db.prepare('SELECT _id, username, email, role FROM users').all();
    console.log('\n📊 Existing users:', existingUsers.length);
    existingUsers.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - ID: ${user._id}`);
    });
    
    // Check if test user exists
    const testUser = db.prepare('SELECT * FROM users WHERE username = ?').get('testuser');
    
    if (testUser) {
      console.log('\n✅ Test user already exists');
      console.log('   Username: testuser');
      console.log('   Password: test123');
    } else {
      console.log('\n➕ Creating new test user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      // Insert test user
      const result = db.prepare(`
        INSERT INTO users (username, email, password_hash, full_name, role, position, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
      `).run(
        'testuser',
        'test@redsea.com',
        hashedPassword,
        'Test User',
        'user',
        'Test Position'
      );
      
      console.log('✅ Test user created successfully!');
      console.log('   ID:', result.lastInsertRowid);
      console.log('   Username: testuser');
      console.log('   Password: test123');
      console.log('   Email: test@redsea.com');
    }
    
    // Also ensure root user exists
    const rootUser = db.prepare('SELECT * FROM users WHERE username = ?').get('root');
    
    if (!rootUser) {
      console.log('\n➕ Creating root user...');
      const rootPassword = await bcrypt.hash('redsea@2024', 10);
      
      db.prepare(`
        INSERT INTO users (username, email, password_hash, full_name, role, position, is_active, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 1, datetime('now'))
      `).run(
        'root',
        'root@redsea.com',
        rootPassword,
        'Root Administrator',
        'root',
        'System Administrator'
      );
      
      console.log('✅ Root user created!');
      console.log('   Username: root');
      console.log('   Password: redsea@2024');
    }
    
    // Show all users
    console.log('\n📋 All users in database:');
    const allUsers = db.prepare('SELECT _id, username, email, role, is_active FROM users').all();
    console.table(allUsers);
    
    db.close();
    
    console.log('\n✅ Done! You can now login with:');
    console.log('   Username: testuser');
    console.log('   Password: test123');
    console.log('\n   OR');
    console.log('   Username: root');
    console.log('   Password: redsea@2024');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

createTestUser();
