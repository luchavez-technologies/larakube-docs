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
You have two "Masterpiece" options on Linux:

**Option A: k3d (Recommended for Dev)**
Runs Kubernetes inside Docker. It’s isolated and easy to destroy.
```bash
larakube cluster:setup
# Select k3d
```

**Option B: k3s (Recommended for Edge/Staging)**
Installs Kubernetes as a native Linux service.
```bash
larakube cluster:setup
# Select k3s
```

### 3. Trust the Root CA
```bash
larakube trust
```

## 📐 Why Linux?
LaraKube on Linux is "Architecture-Complete." Because there is no VM translation layer (like on Mac/Windows), network performance is instantaneous, and volume mounting uses native Linux primitives for maximum reliability.
