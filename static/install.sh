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

# 3. Check for Existing Installation
if command -v larakube &> /dev/null; then
    echo "📦 LaraKube is already installed at $(which larakube). Updating to the latest version..."
fi

# 4. Detect OS and Architecture
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
HTTP_STATUS=$(curl -sL -w "%{http_code}" -o /tmp/larakube "$LATEST_RELEASE_URL")

if [ "$HTTP_STATUS" -ne 200 ]; then
    echo "❌ Error: Download failed with status $HTTP_STATUS"
    echo "URL: $LATEST_RELEASE_URL"
    exit 1
fi

# 4. Global Installation
echo "🚚 Installing LaraKube to /usr/local/bin/larakube (requires sudo)..."
sudo mv /tmp/larakube /usr/local/bin/larakube
sudo chmod +x /usr/local/bin/larakube

# 5. Global Configuration Initialization
echo "⚙️ Initializing global configuration..."
mkdir -p ~/.larakube
if [ ! -f ~/.larakube/config.json ]; then
    echo '{"email": "email@example.com"}' > ~/.larakube/config.json
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
echo "Next steps:"
echo " 1. Run 'larakube config:mcp --all' to enable AI orchestration."
echo " 2. Run 'larakube new' to build your first masterpiece!"
echo ""
