#!/bin/bash

# Ensure we are in the docs directory
cd "$(dirname "$0")"

echo "📦 Pre-syncing dependencies via Docker..."
# We run npm install on the host-mounted volume so it persists for Docker Compose
./npm install --silent

echo "🧹 Cleaning up old Docker volumes..."
docker compose down -v 2>/dev/null

echo "🚀 Starting LaraKube Documentation in Docker..."
echo "Please wait a moment for the initial setup..."

# We use --build to ensure the image is fresh
docker compose up --build
