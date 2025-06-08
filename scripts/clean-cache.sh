#!/bin/bash

# Clean Next.js Cache and Restart Development Server
echo "🧹 Cleaning Next.js cache..."

# Kill any running Next.js processes
pkill -f "next" 2>/dev/null || true

# Remove cache directories
rm -rf .next
rm -rf node_modules/.cache

echo "✅ Cache cleared successfully!"
echo "🚀 Starting fresh development server..."

# Start development server
npm run dev 