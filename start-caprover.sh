#!/bin/bash

echo "🚀 Starting Chat Server deployment..."

# Set production environment
export NODE_ENV=production
export PORT=80

# Debug environment variables (safely)
echo "📋 Environment Check:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL configured: $([ -n "$DATABASE_URL" ] && echo "YES" || echo "NO")"

# If no DATABASE_URL is set, try to construct from CapRover internal services
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️ DATABASE_URL not found, checking for CapRover database service..."
    if [ -n "$POSTGRES_PASSWORD" ] && [ -n "$POSTGRES_DB" ]; then
        export DATABASE_URL="postgresql://postgres:$POSTGRES_PASSWORD@srv-captain--dokterapp:5432/$POSTGRES_DB?schema=public"
        echo "✅ Using CapRover internal database connection"
    else
        echo "❌ No database configuration found!"
        exit 1
    fi
fi

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