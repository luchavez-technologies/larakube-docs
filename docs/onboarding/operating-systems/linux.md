---
sidebar_position: 3
title: Linux
description: High-performance guide for deploying Laravel on Kubernetes using native k3s or k3d on Linux.
---
# 🐧 Linux

On Linux, LaraKube CLI provides a raw, high-performance Kubernetes experience. You have the choice between running k3s in Docker (k3d) or as a native system service.

## 🛠 Prerequisites
1.  **Docker Engine**: Ensure Docker is installed and your user is in the `docker` group.
2.  **kubectl**: The standard Kubernetes CLI.

## 🚀 Setup Instructions

### 1. Install LaraKube CLI
```bash
curl -sSL https://larakube.luchtech.dev/install.sh | bash
```

### 2. Prepare your Cluster
For the best balance of isolation and performance on Linux, we recommend using **k3d**. It runs a full Kubernetes cluster inside your existing Docker engine, making it easy to create and destroy per-project environments.

```bash
# Automated k3d cluster creation
larakube cluster:setup
```

#### 💡 The k3s Alternative
If you are setting up a dedicated machine (like an edge server or a permanent staging box), you can install **k3s** as a native system service for persistent orchestration:
```bash
larakube cluster:setup
# Select k3s when prompted
```

### 3. Trust the Root CA
```bash
larakube trust
```

## 📐 Why Linux?
LaraKube CLI on Linux is "Architecture-Complete." Because there is no VM translation layer (like on Mac/Windows), network performance is instantaneous, and volume mounting uses native Linux primitives for maximum reliability.
