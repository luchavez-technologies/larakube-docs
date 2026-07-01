---
sidebar_position: 2
title: Windows
description: How to run LaraKube on Windows using WSL2 and k3s.
---
# 🪟 Windows (WSL2)

LaraKube CLI is built for professional Kubernetes orchestration. Because of the complex networking and file permission requirements of Kubernetes, **Windows users MUST use WSL2.**

:::danger No Windows-Native Support
We do not support running LaraKube CLI directly in PowerShell or CMD. You will encounter pathing and symlink errors. Always use the instructions below.
:::

## 🛠 Prerequisites

1. **WSL2 (Ubuntu Recommended)**: Install via `wsl --install`, or install **Ubuntu from the Microsoft Store** — this tends to cause fewer headaches than the distro `wsl --install` provisions by default.
2. That's it — `larakube setup` handles Docker Engine and the cluster for you.

:::tip Already using Docker Desktop?
You don't need to uninstall it — but we recommend **quitting Docker Desktop** (right-click its tray icon → Quit) before running `larakube setup`, so a native Docker Engine can be installed inside WSL2 instead of relying on Docker Desktop's integration.

This is safe: it won't touch or break any existing Docker Desktop images, containers, or volumes. When you relaunch Docker Desktop afterwards, its own Docker CLI takes priority again in any distro it's integrated with — the native install inside WSL2 keeps working independently.

Docker Engine installed directly inside WSL2 is preferred for new setups because it has no quirks with k3s. But if Docker Desktop is already running for other projects, `larakube setup` handles it transparently.
:::

:::caution Docker Desktop's CLI can "leak" into a fresh WSL2 distro
If Docker Desktop is installed on Windows — even if it isn't currently running — its `docker` CLI can still show up inside a brand-new Ubuntu WSL2 install via Docker Desktop's WSL integration. This is expected and harmless, but it can cause `wsl` to behave oddly if you have multiple distros (e.g. commands landing in the wrong one). If that happens, run this from PowerShell to make sure your intended distro is the default:

```powershell
wsl --set-default Ubuntu
```
:::

## 🚀 Setup Instructions

### 1. Enter your WSL2 Terminal
Open your Ubuntu (or other Linux) terminal. All subsequent commands must be run here.

### 2. Install LaraKube CLI
```bash
curl -fsSL https://cli.larakube.app/install.sh | bash
```

### 3. Run setup
```bash
larakube setup
```

This installs Docker Engine (if needed), sets up a k3s cluster inside WSL2, and optionally installs k9s for browsing the cluster. Because k3s lives in the same environment as your terminal, it can see your project files at their real paths — which is exactly what `larakube up` needs.

### 4. Trust SSL
```bash
larakube trust
```

This installs the LaraKube Local CA into the Windows certificate store so your Windows browser trusts HTTPS on your local apps.

### 5. Create and start your first app
```bash
larakube new my-app
cd my-app
larakube up
```

## 📐 Why WSL2 + k3s?

LaraKube's local development model mounts your project directory directly into the running pods so code changes are reflected instantly without rebuilding images. For this to work, the Kubernetes node must share the same filesystem as your terminal session.

k3s running inside WSL2 satisfies this — it IS your WSL2 environment. Docker Engine installed directly in WSL2 runs in the same environment too, so both k3s and `docker build` share your project files at their real paths.

Your Laravel code stays on the Linux filesystem, which also means you avoid the slow "9p" cross-filesystem performance that comes with storing projects on the Windows drive (`/mnt/c/...`).
