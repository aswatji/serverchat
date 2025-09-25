#!/bin/sh

echo "🚀 Starting Chat Server deployment..."

# Generate Prisma client
echo "📦 Generating Prisma client..."
npx prisma generate

# Run database migrations (non-interactive)
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "🎯 Starting application..."
exec npm start