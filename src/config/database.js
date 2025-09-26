const { Pool } = require("pg");

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

console.log("🔍 Database URL:", process.env.DATABASE_URL.replace(/:[^:@]*@/, ':***@'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err);
});

// Test initial connection
pool.connect()
  .then(client => {
    console.log("🗄️ Database connection pool initialized successfully");
    client.release();
  })
  .catch(err => {
    console.error("❌ Failed to initialize database connection:", err);
    process.exit(1);
  });

module.exports = pool;
