#!/bin/bash
# Render Build Script for Regalytics Backend
# This runs during deployment on Render

set -e  # Exit on error

echo "🔨 Starting Render build process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build TypeScript
echo "🏗️  Compiling TypeScript..."
npm run build

echo "✅ Build completed successfully!"
echo "🚀 Backend will start with: npm start"

