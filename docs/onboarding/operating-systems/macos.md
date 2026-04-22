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
LaraKube works best when it has full control over the local networking bridge.
1.  Open **OrbStack Settings** ➔ **Kubernetes**.
2.  Ensure native Kubernetes is **OFF** (to free up ports 80/443).
3.  Run the LaraKube setup:
    ```bash
    larakube cluster:setup
    ```
    *Choose **k3d** when prompted.*

### 3. Trust the Root CA
To enable seamless HTTPS (`https://*.dev.test`), install the LaraKube Local CA:
```bash
larakube trust
```

## 📐 Why macOS?
LaraKube CLI uses specialized **Kustomize patches** for macOS to resolve common volume permission issues, ensuring that your `storage/` and `bootstrap/cache` directories just work.
