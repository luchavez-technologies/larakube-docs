---
sidebar_position: 3
title: Linux
description: How to run LaraKube on Linux using native k3s.
---
# 🐧 Linux

On Linux, LaraKube runs k3s as a native system service — no VM, no translation layer, just Kubernetes running directly on your machine.

## 🛠 Prerequisites

1. **Linux** (Ubuntu recommended): Any modern distribution works.
2. That's it — `larakube setup` handles Docker Engine and the cluster for you.

## 🚀 Setup Instructions

### 1. Install LaraKube CLI
```bash
curl -fsSL https://cli.larakube.app/install.sh | bash
```

### 2. Run setup
```bash
larakube setup
```

This installs Docker Engine (if needed), sets up a k3s cluster, and optionally installs k9s for browsing the cluster.

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

## 📐 Why native k3s?

Because there is no VM layer, k3s shares your filesystem directly — the same directory you edit in your terminal is what runs inside the pod. Network performance is native, and volume mounts use standard Linux bind mounts with no overhead.
