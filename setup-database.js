const { Pool } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
  });

  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const result = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename IN ('User', 'Chat', 'Message')
    `);
    
    console.log(`📊 Found ${result.rows.length} tables:`, result.rows.map(r => r.tablename));
    
    if (result.rows.length < 3) {
      console.log('🔧 Setting up database schema...');
      
      // Create tables
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
            uid VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Chat" (
            chat_id VARCHAR(36) PRIMARY KEY,
            user1_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
            user2_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user1_id, user2_id)
        );
      `);
      
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Message" (
            message_id VARCHAR(36) PRIMARY KEY,
            chat_id VARCHAR(36) NOT NULL REFERENCES "Chat"(chat_id) ON DELETE CASCADE,
            sender_id VARCHAR(36) NOT NULL REFERENCES "User"(uid) ON DELETE CASCADE,
            content TEXT NOT NULL,
            sent_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );
      `);
      
      // Create indexes
      await client.query(`CREATE INDEX IF NOT EXISTS idx_message_chat_id ON "Message"(chat_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_message_sent_at ON "Message"(sent_at)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_chat_user1 ON "Chat"(user1_id)`);
      await client.query(`CREATE INDEX IF NOT EXISTS idx_chat_user2 ON "Chat"(user2_id)`);
      
      // Insert sample data
      await client.query(`
        INSERT INTO "User" (uid, name, email) VALUES 
        ('user-1', 'John Doe', 'john@example.com'),
        ('user-2', 'Jane Smith', 'jane@example.com')
        ON CONFLICT (email) DO NOTHING
      `);
      
      console.log('✅ Database schema setup completed');
    } else {
      console.log('✅ Database schema already exists');
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();