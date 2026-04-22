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
Inside your WSL2 terminal, run:
```bash
larakube cluster:setup
```
*Choose **k3d** when prompted.*

### 4. Port Forwarding
Since you are on Windows, ensure that your firewall allows Docker Desktop to listen on ports 80 and 443. Your browser on Windows will talk to the cluster inside WSL2 seamlessly.

## 📐 Why WSL2?
By running LaraKube inside WSL2, you get true Linux-native performance and file compatibility. Your Laravel code remains on the Linux filesystem, avoiding the slow "9p" mount performance of the standard Windows drive mounts.
