---
sidebar_position: 1
title: macOS
description: How to run LaraKube on macOS using OrbStack or Docker Desktop.
---
# 🍎 macOS

LaraKube CLI is a first-class citizen on macOS. For the most stable and high-performance experience, we recommend using **OrbStack**.

:::warning `larakube setup` does not run on macOS
`larakube setup` and native k3s require a Linux kernel. On macOS, Kubernetes runs inside a Linux VM managed by OrbStack or Docker Desktop — use their built-in Kubernetes instead.
:::

## 🛠 Prerequisites

1. **OrbStack** (Recommended) or **Docker Desktop**: The engine that will run your containers and Kubernetes nodes.
2. **Homebrew**: For managing local dependencies.

## 🚀 Setup Instructions

### 1. Install LaraKube CLI

#### Option A — Homebrew (recommended)
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
If you previously ran `install.sh`, a `larakube` binary lives in `/usr/local/bin` and can **shadow** the Homebrew version on your `PATH`. Remove it and let Homebrew take over:

```bash
sudo rm -f /usr/local/bin/larakube
hash -r
which larakube       # should now resolve to your Homebrew prefix
larakube --version   # confirm the Homebrew version
```
:::

Upgrade later with:
```bash
brew upgrade larakube
```

#### Option B — Standalone binary
```bash
curl -fsSL https://cli.larakube.app/install.sh | bash
```

### 2. Enable Kubernetes

LaraKube needs a Kubernetes cluster running locally. Enable the built-in one from your container engine:

- **OrbStack**: Settings → Kubernetes → toggle **On**
- **Docker Desktop**: Settings → Kubernetes → check **Enable Kubernetes**

LaraKube automatically detects these contexts.

### 3. Trust SSL
```bash
larakube trust
```

### 4. Create and start your first app
```bash
larakube new my-app
cd my-app
larakube up
```

## 📐 Why OrbStack?

OrbStack runs a Linux VM with built-in Kubernetes that starts in seconds, uses less memory than Docker Desktop, and mounts your Mac filesystem into the VM with near-native performance. LaraKube uses Kustomize patches specifically tuned for macOS to resolve common volume permission issues in `storage/` and `bootstrap/cache/`.
