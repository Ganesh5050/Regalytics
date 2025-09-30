#!/bin/bash
# Start the backend server

echo "🚀 Starting Regalytics Backend Server..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🔥 Starting development server on port 3001..."
npm run dev
