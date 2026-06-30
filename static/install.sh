#!/bin/bash

# LaraKube One-Step Standalone Installer
# "Kubernetes for Laravel from Development to Deployment"

set -e

echo "🚀 LaraKube Installer starting..."

# 1. Detect OS and Architecture
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

# 2. Check for Existing Installation
if command -v larakube &> /dev/null; then
    echo "📦 LaraKube is already installed at $(which larakube). Updating to the latest version..."
fi

BINARY_NAME="larakube-$OS-$ARCH"
LATEST_RELEASE_URL="https://github.com/luchavez-technologies/larakube-cli/releases/latest/download/$BINARY_NAME"

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
echo " 1. Verify installation: larakube --version"
if [ "$OS" == "linux" ]; then
    echo " 2. Set up your environment: larakube setup"
    echo " 3. Create your first app:   larakube new my-app"
else
    echo " 2. Create your first app: larakube new my-app"
fi
echo ""
