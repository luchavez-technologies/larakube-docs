#!/bin/bash

# Ensure we are in the docs directory
cd "$(dirname "$0")"

echo "📦 Pre-syncing dependencies..."
./npm install --silent

echo "🏗 Building production assets..."
./npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🚀 Launching production preview at http://localhost:3000..."
    echo "Press Ctrl+C to stop."
    ./npm run serve
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
