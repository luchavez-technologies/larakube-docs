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
Download and install the standalone binary:
```bash
curl -sSL https://larakube.luchtech.dev/install.sh | bash
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
