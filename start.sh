#!/bin/sh

echo "🚀 Starting Chat Server deployment..."

# Set production environment
export NODE_ENV=production

# Debug environment variables
echo "📋 Environment Variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..." # Only show first 30 chars for security

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations (non-interactive)
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Check if migration was successful
if [ $? -eq 0 ]; then
    echo "✅ Database migrations completed successfully"
else
    echo "❌ Database migrations failed"
    exit 1
fi

# Start the application
echo "🎯 Starting application..."
exec npm start