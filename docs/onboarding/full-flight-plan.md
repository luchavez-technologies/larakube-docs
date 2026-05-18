---
sidebar_position: 6
title: "Tutorial: Full Flight Plan"
description: A complete step-by-step journey from creating your project to a professional production deployment via Cloud Pilot.
---
# 🏁 Full Flight Plan: From New to Kube

This guide walks you through the complete LaraKube journey: from scaffolding a new masterpiece on your laptop to a professional, automated GitOps deployment in the cloud.

---

## 🏎️ Phase 1: Local Launch
Start by creating your application with the LaraKube CLI.

```bash
# 1. Scaffold your project
larakube new my-masterpiece --fast

# 2. Enter the directory
cd my-masterpiece

# 3. Launch your local cluster
larakube up
```

*Your app is now running at `https://my-masterpiece.dev.test` with perfect production parity.*

---

## 🛠️ Phase 2: Cloud Provisioning
Now, let's prepare your Linux VPS (Single-Node Hero) for its first deployment.

```bash
# 1. Point your domain (e.g., app.larakube.com) to your VPS IP address.

# 2. Hardening and K3s installation
larakube cloud:provision
```

*Follow the prompts to enter your Server IP, SSH credentials, and email for Let'sEncrypt. This command will also set up a 1GB Swap file for stability.*

---

## ⚙️ Phase 3: Cloud Configuration
Connect your local code to your remote server and configure your GitOps pipeline.

```bash
# 1. Link your project to the remote VPS
larakube cloud:configure server

# 2. Set up GitHub Actions CI/CD
larakube cloud:configure gha
```

### What's happening here:
-   The **Server** configuration clones your repository onto the VPS and uploads your initial `.env.production` file.
-   The **GHA** configuration encodes your secrets, extracts your minified Kubeconfig, and generates a hardened `.github/workflows/larakube-deploy-production.yml` file.

---

## 🚀 Phase 4: Final Departure (Git Push)
You're cleared for takeoff. Deploy your masterpiece by simply pushing your code to GitHub.

```bash
# 1. Add and commit your changes
git add .
git commit -m "🚀 Initial LaraKube Cloud Pilot deployment"

# 2. Push to your trigger branch (e.g., main)
git push origin main
```

### 🔭 Mission Control
Head over to your **GitHub Actions** tab to watch the build. Once complete, your application will be live at your production domain with automated SSL!

---

## 🏆 Summary
You've just completed a professional Kubernetes deployment workflow:
1.  **Local Dev**: Perfect parity with K3d.
2.  **Hardening**: VPS secured and stabilized with Swap.
3.  **GitOps**: Fully automated pipeline with GHCR.
4.  **Scaling Ready**: You can now scale horizontally or "graduate" to multi-node managed K8s without changing your `.larakube.json` blueprint.
