---
sidebar_position: 2
title: Windows
description: Professional guide for running Laravel Kubernetes clusters on Windows using WSL2 and Docker Desktop.
---
# 🪟 Windows (WSL2)

LaraKube CLI is built for professional Kubernetes orchestration. Because of the complex networking and file permission requirements of Kubernetes, **Windows users MUST use WSL2.**

:::danger No Windows-Native Support
We do not support running LaraKube CLI directly in PowerShell or CMD. You will encounter pathing and symlink errors. Always use the instructions below.
:::

## 🛠 Prerequisites
1.  **WSL2 (Ubuntu Recommended)**: Install via `wsl --install`.
2.  **Docker Desktop**:
    - Go to **Settings** ➔ **General** ➔ Enable **Use the WSL 2 based engine**.
    - Go to **Settings** ➔ **Resources** ➔ **WSL Integration** ➔ Enable for your distribution (e.g. `Ubuntu`).

## 🚀 Setup Instructions

### 1. Enter your WSL2 Terminal
Open your Ubuntu (or other Linux) terminal. All subsequent commands must be run here.

### 2. Install LaraKube CLI
Download and install the standalone binary inside WSL2:
```bash
curl -sSL https://larakube.luchtech.dev/install.sh | bash
```

### 3. Prepare your Cluster
Windows users have two elite options for local Kubernetes:

**Option A: Docker Desktop (Integrated)**
For the most integrated experience, use the engine provided by Docker Desktop:
1.  Open **Docker Desktop Settings** ➔ **Kubernetes**.
2.  Check **Enable Kubernetes**.

LaraKube CLI inside WSL2 will automatically detect and orchestrate this cluster.

**Option B: k3d (Automated & Isolated)**
If you prefer a more isolated cluster approach inside your WSL2 environment:
```bash
# Automated k3d cluster creation
larakube cluster:setup
```

### 4. Port Forwarding & Trust
1.  **Trust SSL**: Run `larakube trust` inside your WSL2 terminal to install the Local CA.
2.  **Firewall**: Ensure your Windows firewall allows Docker Desktop to listen on ports 80 and 443.

Your Windows browser will talk to the cluster inside WSL2 seamlessly.

## 📐 Why WSL2?
By running LaraKube inside WSL2, you get true Linux-native performance and file compatibility. Your Laravel code remains on the Linux filesystem, avoiding the slow "9p" mount performance of the standard Windows drive mounts.
