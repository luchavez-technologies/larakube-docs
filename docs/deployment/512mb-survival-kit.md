---
sidebar_position: 4
title: The 512MB Survival Kit
description: How LaraKube keeps your low-RAM VPS stable with automated swap and remote build offloading.
---
# 📦 The 512MB Survival Kit

Running production-grade Kubernetes on a tiny 512MB or 1GB VPS (like a $4 Droplet) is a tightrope walk. LaraKube is engineered to keep your services stable, preventing common **Out-Of-Memory (OOM)** crashes with two primary safeguards.

## 1. Automated Swap File
When you run `larakube cloud:provision`, the CLI automatically detects your system's memory. If it's below a safe threshold, it takes immediate action:
- **1GB Swap Creation**: It provisions a 1GB swap file and configures it at the OS level.
- **Why this matters**: Linux memory management can be brutal. Swap provides a vital safety buffer for background services (like database maintenance or logs) during traffic spikes, ensuring that your core Laravel services don't get terminated by the kernel.

## 2. Remote Build Offloading
The most common cause of OOM crashes on small VPSs is the **Docker build process**. Building container images consumes massive amounts of RAM, often exceeding the total memory of a tiny droplet.

### The LaraKube Solution:
LaraKube forces all image builds to the **GitHub Actions Runner** (via `cloud:configure gha`).
- **Zero-RAM Build Cost**: Your VPS never compiles a single line of code or builds a layer.
- **Efficiency**: The VPS simply pulls the pre-built, ready-to-run image from the GitHub Container Registry (GHCR).
- **Outcome**: Your RAM is dedicated 100% to your application, not the build pipeline.

*LaraKube turns your "tiny" VPS into a reliable production environment by intelligently managing your resources and offloading heavy tasks.*
