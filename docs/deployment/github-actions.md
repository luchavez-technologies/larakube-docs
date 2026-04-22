---
sidebar_position: 2
title: CI/CD with GitHub Actions
description: Automate your Laravel deployment with LaraKube's GitHub Actions workflow. Learn about multi-stage PHP builds, GHCR publishing, and zero-downtime rolls.
---
# GitHub Actions (CI/CD)

LaraKube automates your entire deployment pipeline using GitHub Actions. Every project comes pre-scaffolded with a production-grade workflow.

## ⚡️ The Automated Pipeline
When you push code to your `main` branch, the following steps occur:

1.  **Frontend Build:** A temporary Node.js stage installs dependencies and compiles your assets using Vite.
2.  **Multi-Stage PHP Build:** The compiled assets are copied into a fresh PHP image. This ensures your production image is "self-contained" and contains no unnecessary Node.js overhead.
3.  **GHCR Publication:** The image is pushed to the **GitHub Container Registry (GHCR)**.
4.  **Cluster Deployment:** The latest version is rolled out to your Kubernetes cluster with zero downtime.

## 🔐 Configuring Secrets
To enable the automated pipeline, you must securely upload your configuration to GitHub. Run the following command for your target environment:

```bash
larakube gha:configure production
```

### What this command does:
- Uses an isolated GitHub CLI container (no local installation needed).
- Uploads your `.env.production` as a GitHub Secret.
- Uploads your current `KUBECONFIG` as a GitHub Secret.
- Sets up the registry authentication for your cluster.

## Manual Deployments
If you need to push a quick update without a Git push, you can deploy manually from your terminal:

```bash
larakube deploy production
```
