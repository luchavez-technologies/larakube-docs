#!/bin/bash

# Ensure we are in the docs directory
cd "$(dirname "$0")"

echo "🚀 Starting LaraKube Documentation in Docker..."
echo "Please wait a moment for the initial setup..."

docker compose up --build
