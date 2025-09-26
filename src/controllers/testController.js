const pool = require("../config/database");

const testDatabaseConnection = async (req, res, next) => {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test 1: Simple connection
    const client = await pool.connect();
    console.log('✅ Database connection successful');
    
    // Test 2: Check if tables exist
    const tablesResult = await client.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      ORDER BY tablename
    `);
    
    console.log('📊 Available tables:', tablesResult.rows);
    
    // Test 3: Try to query User table
    let userCount = 0;
    try {
      const userResult = await client.query('SELECT COUNT(*) as count FROM "User"');
      userCount = userResult.rows[0].count;
      console.log('👥 User count:', userCount);
    } catch (userError) {
      console.log('❌ User table error:', userError.message);
    }
    
    client.release();
    
    res.json({
      success: true,
      database: 'connected',
      tables: tablesResult.rows,
      userCount: userCount
    });
    
  } catch (error) {
    console.error('❌ Database test error:', error);
    next(error);
  }
};

module.exports = { testDatabaseConnection };