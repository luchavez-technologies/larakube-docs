---
sidebar_position: 5
title: GitOps with GitHub Actions
description: Learn how LaraKube automates your production deployments using GitHub Actions and the GitHub Container Registry (GHCR).
---
# 🔐 Professional GitOps with GHA

LaraKube provides a professional, "GitOps-First" deployment workflow that offloads the heavy lifting to GitHub, ensuring your production servers remain stable and performant.

## 🚀 The Build Engine (Zero-OOM)
Running Docker builds on a small VPS can easily lead to **Out-Of-Memory (OOM)** crashes. LaraKube solves this by offloading all image builds to **GitHub Runners**.
-   **Server Stability**: Your VPS never has to perform a CPU-intensive Docker build.
-   **Speed**: GitHub Runners utilize high-performance hardware and a global caching layer for blazing-fast builds.
-   **Security**: Images are securely pushed to your private **GitHub Container Registry (GHCR)**.

## 🛠 The Configuration Lifecycle
Setting up a CI/CD pipeline usually takes hours. With LaraKube, it takes one command:

```bash
larakube cloud:configure gha
```

### What happens under the hood?
1.  **Secret Injection**: The CLI automatically encodes and uploads your `.env.{environment}` file to GitHub as a Base64 secret.
2.  **Kubeconfig Extraction**: LaraKube surgically extracts the specific cluster context for your environment (using `--minify`) and uploads it as a GitHub Secret.
3.  **Registry Setup**: Automatically configures the `ghcr-login` secret on your remote VPS so Kubernetes can pull your private images.
4.  **Workflow Generation**: Scaffolds a hardened `.github/workflows/larakube-deploy-{env}.yml` file tailored specifically to your project's architecture.

## 🛡 Security Standards

### 1. Literal Secret Injection
Unlike traditional deployments that might leak secrets into logs, LaraKube uses a **Literal Injection** strategy. Your environment variables are securely injected into the Kubernetes Secret manifest during the GHA run, ensuring they never touch your Git repository in plain text.

### 2. Surgical Context Extraction
The `KUBECONFIG` secret uploaded to GitHub is **Minified**. This means it only contains the certificate and token required for that specific environment. Your local development contexts (like `k3d-larakube`) are never leaked to the cloud.

## 📋 Required Secrets
When you run `cloud:configure gha`, LaraKube manages these for you:
-   `{ENV}_KUBECONFIG`: The minified credentials for your cluster.
-   `{ENV}_ENV_FILE_BASE64`: Your production-ready environment variables.

## 🏁 The "Push-to-Deploy" Experience
Once configured, your deployment workflow is simple:
1.  **Commit** your changes.
2.  **Push** to your main branch (e.g., `git push origin main`).
3.  **Monitor** the progress in your GitHub Actions tab.
4.  **Relax** while LaraKube performs a rolling, zero-downtime update on your cluster.
