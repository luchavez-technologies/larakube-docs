---
sidebar_position: 6
title: "Tutorial: Full Flight Plan"
description: A complete step-by-step journey from creating your project to a professional production deployment via Cloud Pilot.
---
# 🏁 Full Flight Plan: From New to Kube

This guide walks you through the complete LaraKube CLI journey: from scaffolding a new masterpiece on your laptop to a professional, automated GitOps deployment in the cloud.

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

*Your app is now running at `https://my-masterpiece.kube` with perfect production parity.*

---

## 🛠️ Phase 2: Cloud Provisioning
Now, let's prepare your Linux VPS (Single-Node Hero) for its first deployment.

```bash
# 1. Point your domain (e.g., app.larakube.com) to your VPS IP address.

# 2. Hardening and K3s installation
larakube cloud:init
```

*Follow the prompts to enter your Server IP, SSH credentials, and email for Let'sEncrypt. This command will also set up a 1GB Swap file for stability.*

---

## ⚙️ Phase 3: Cloud Configuration
Connect your local code to your remote server and configure your GitOps pipeline.

```bash
# 1. Link your project to the remote server (IP/SSH + web host)
larakube cloud:configure:base

# 2. Set up GitHub Actions CI/CD
larakube cloud:configure:gha
```

> Or run `larakube cloud:configure` (no suffix) for the **guided** flow that walks
> through the server, an optional shared Commons, and CI in one go.

### What's happening here:
-   The **base** configuration records your server connection (IP/SSH or managed context) and the real web domain into `.larakube.json`.
-   The **GHA** configuration encodes your secrets, extracts your minified Kubeconfig, and generates a hardened `.github/workflows/larakube-deploy-production.yml` file.

---

## 🚀 Phase 4: Final Departure (Git Push)
You're cleared for takeoff. Deploy your masterpiece by simply pushing your code to GitHub.

```bash
# 1. Add and commit your changes
git add .
git commit -m "🚀 Initial LaraKube CLI Cloud Pilot deployment"

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

---

## 🏘️ Going Further: Share a Commons (Plex)
Running a second app on the same box? You don't need a duplicate Postgres/Redis/S3 stack. **Plex** lets multiple apps share one **Commons** — a database (Postgres/MySQL/MariaDB), Redis, Meilisearch, and S3 (SeaweedFS/MinIO) — each app fully isolated with its own database, login, and bucket:

```bash
larakube plex:init             # stand up (or extend) the shared Commons on the cluster
larakube plex:join production  # join this app — provisions its isolated DB + bucket
larakube plex:status           # inspect the Commons and its tenants
```

See **[Two Apps, One Server → Plex](../deployment/multiple-projects#going-further-plex)** for the full walkthrough.

:::note
Plex is validated on a **single-node VPS via both the manual deploy and the GitHub Actions flow above** — apps sharing a Commons deploy cleanly either way. Running the Commons across a **multi-node** cluster (DOKS) isn't validated yet. (Tracking on the [roadmap](../community/roadmap).)
:::
