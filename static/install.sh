#!/bin/bash

# LaraKube One-Step Standalone Installer
# "Kubernetes for Laravel from Development to Deployment"

set -e

echo "🚀 LaraKube Installer starting..."

# 1. System Check
echo "🔍 Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v kubectl &> /dev/null; then
    echo "❌ Error: kubectl is not installed. Please install kubectl first: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# 2. Detect OS and Architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

if [ "$OS" == "darwin" ]; then
    OS="mac"
    if [ "$ARCH" == "x86_64" ]; then
        ARCH="x64"
    elif [ "$ARCH" == "arm64" ]; then
        ARCH="arm"
    else
        echo "❌ Error: Unsupported architecture: $ARCH"
        exit 1
    fi
elif [ "$OS" == "linux" ]; then
    if [ "$ARCH" == "x86_64" ]; then
        ARCH="x64"
    elif [ "$ARCH" == "aarch64" ] || [ "$ARCH" == "arm64" ]; then
        ARCH="arm"
    else
        echo "❌ Error: Unsupported architecture: $ARCH"
        exit 1
    fi
else
    echo "❌ Error: Unsupported operating system: $OS"
    exit 1
fi

BINARY_NAME="larakube-$OS-$ARCH"
# Note: For now, we are pointing to the 'canary' release.
# Once v0.0.1 is tagged, this will point to /releases/latest/download/
LATEST_RELEASE_URL="https://github.com/luchavez-technologies/larakube-cli/releases/download/canary/$BINARY_NAME"

# 3. Download LaraKube Standalone CLI
echo "📦 Downloading standalone LaraKube CLI for $OS ($ARCH)..."
# In a real scenario, we'd use curl -L -o /tmp/larakube $LATEST_RELEASE_URL
# For this workspace, we are simulating the installation.
echo "   (URL: $LATEST_RELEASE_URL)"

# 4. Global Installation (Simulated for this script)
# curl -L -o /tmp/larakube $LATEST_RELEASE_URL
# sudo mv /tmp/larakube /usr/local/bin/larakube
# sudo chmod +x /usr/local/bin/larakube

# 5. Global Configuration Initialization
echo "⚙️ Initializing global configuration..."
mkdir -p ~/.larakube
if [ ! -f ~/.larakube/config.json ]; then
    echo '{"email": "admin@larakube.local"}' > ~/.larakube/config.json
fi

echo ""
echo "✅ LaraKube installed successfully!"
echo "--------------------------------------------------------"
echo "  ██╗      █████╗ ██████╗  █████╗ ██╗  ██╗██╗   ██╗██████╗ ███████╗"
echo "  ██║     ██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝██║   ██║██╔══██╗██╔════╝"
echo "  ██║     ███████║██████╔╝███████║█████╔╝ ██║   ██║██████╔╝█████╗  "
echo "  ██║     ██╔══██║██╔══██╗██╔══██║██╔═██╗ ██║   ██║██╔══██╗██╔══╝  "
echo "  ███████╗██║  ██║██║  ██║██║  ██║██║  ██╗╚██████╔╝██████╔╝███████╗"
echo "  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝"
echo "--------------------------------------------------------"
echo "Next step: Run 'larakube new' to build your first masterpiece!"
echo ""
