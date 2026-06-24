---
sidebar_position: 1
title: macOS
description: The elite guide for setting up Laravel on Kubernetes using macOS, OrbStack, and k3d.
---
# 🍎 macOS

LaraKube CLI is a first-class citizen on macOS. For the most stable and high-performance experience, we recommend using **OrbStack**.

## 🛠 Prerequisites
1.  **OrbStack** (Recommended) or **Docker Desktop**: The engine that will run your containers and Kubernetes nodes.
2.  **Homebrew**: For managing local dependencies like `kubectl` or `k9s`.

## 🚀 Setup Instructions

### 1. Install LaraKube CLI

#### Option A — Homebrew (recommended on macOS)
The cleanest path on Mac. You get versioned upgrades via `brew upgrade`:
```bash
brew tap luchavez-technologies/larakube
brew trust luchavez-technologies/larakube
brew install larakube
```

:::note Why `brew trust`?
Recent Homebrew versions refuse to load formulae from third-party taps until you explicitly trust them. It's a one-time acknowledgement per tap — if you skip it, `brew install` fails with *"Refusing to load formula … from untrusted tap."*
:::

:::warning Migrating from the standalone installer?
If you previously ran `install.sh`, a `larakube` binary lives in `/usr/local/bin` and can **shadow** the Homebrew version on your `PATH` — so `larakube --version` keeps reporting the old build instead of the one you just installed. Remove the standalone binary and let Homebrew take over:

```bash
sudo rm -f /usr/local/bin/larakube
hash -r                 # clear your shell's cached path (or open a new terminal)
which larakube          # should now resolve to your Homebrew prefix
larakube --version      # confirm the Homebrew version
```
:::

Upgrade later with:
```bash
brew upgrade larakube
```

#### Option B — Standalone binary
Prefer a single self-contained binary (no Homebrew)? Use the installer:
```bash
curl -fsSL https://cli.larakube.app/install.sh | bash
```

### 2. Prepare your Cluster
For the fastest and most integrated experience on macOS, we recommend using the **built-in Kubernetes** provided by your container engine:

1.  **OrbStack Users**: Go to **Settings** ➔ **Kubernetes** and toggle it **ON**.
2.  **Docker Desktop Users**: Go to **Settings** ➔ **Kubernetes** and check **Enable Kubernetes**.

LaraKube CLI will automatically detect these contexts and manage your manifests flawlessly.

#### 💡 The k3d Alternative
If you prefer a more isolated, cluster-per-project approach, or if you don't want to use the built-in engines, LaraKube CLI has built-in automation for **k3d**:

```bash
# Automated k3d cluster creation
larakube cluster:setup
```

### 3. Trust the Root CA
To enable seamless HTTPS (`https://*.kube`), install the LaraKube Local CA:
```bash
larakube trust
```

## 📐 Why macOS?
LaraKube CLI uses specialized **Kustomize patches** for macOS to resolve common volume permission issues, ensuring that your `storage/` and `bootstrap/cache` directories just work.
