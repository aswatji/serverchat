#!/bin/bash#!/bin/bash



# CapRover deployment startup script untuk debuggingecho "🚀 Starting Chat Server deployment..."

echo "🚀 Starting Chat Server for CapRover..."

echo "📊 Environment: $NODE_ENV"# Set production environment

echo "🌐 Port: $PORT"export NODE_ENV=production

echo "🗄️ Database URL: ${DATABASE_URL:0:30}..." export PORT=80



# Test database connection terlebih dahulu# Debug environment variables (safely)

echo "🔍 Testing database connection..."echo "📋 Environment Check:"

node -e "echo "NODE_ENV: $NODE_ENV"

const { Pool } = require('pg');echo "PORT: $PORT"

const pool = new Pool({ connectionString: process.env.DATABASE_URL });echo "DATABASE_URL configured: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"

pool.connect()

  .then(() => {# If no DATABASE_URL is set, try to construct from CapRover internal services

    console.log('✅ Database connection successful');if [ -z "$DATABASE_URL" ]; then

    pool.end();    echo "⚠️ DATABASE_URL not found, checking for CapRover database service..."

  })    if [ -n "$POSTGRES_PASSWORD" ] && [ -n "$POSTGRES_DB" ]; then

  .catch(err => {        export DATABASE_URL="postgresql://postgres:$POSTGRES_PASSWORD@srv-captain--dokterapp:5432/$POSTGRES_DB?schema=public"

    console.error('❌ Database connection failed:', err.message);        echo "✅ Using CapRover internal database connection"

    process.exit(1);    else

  });        echo "❌ No database configuration found!"

"        exit 1

    fi

echo "🎯 Starting main application..."fi

exec node index.js
# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Test database connection first
echo "🔍 Testing database connection..."
npx prisma db pull --preview-feature || {
    echo "❌ Database connection failed"
    echo "🔧 Trying to create database schema..."
    npx prisma db push || {
        echo "❌ Failed to create database schema"
        exit 1
    }
}

# Run database migrations (non-interactive)
echo "🗄️ Running database migrations..."
npx prisma migrate deploy || {
    echo "⚠️ Migration failed, trying db push instead..."
    npx prisma db push || {
        echo "❌ Database setup failed"
        exit 1
    }
}

echo "✅ Database setup completed successfully"

# Start the application
echo "🎯 Starting application on port $PORT..."
exec npm start