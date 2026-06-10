---
sidebar_position: 6
title: Air-Gapped Bundles (Enterprise On-Prem)
description: Package your entire application into a single, offline, plug-and-play USB stick for enterprise clients.
---

# Air-Gapped Enterprise Deliveries

One of the biggest milestones for a SaaS application is landing an Enterprise contract that mandates **On-Premise, Air-Gapped Hosting**. The hospital, bank, or government agency wants to buy your software, but they demand it runs entirely on their offline, internal servers. 

Historically, this meant shipping them your raw source code or a massive, fragile Bash script that failed unpredictably.

LaraKube solves this elegantly via **Air-Gapped Bundles**. You can compile your entire stack—including your app, Traefik, MySQL, Kubernetes itself, and an installation wizard—into a single folder you can drag onto a USB stick.

Here is the exact technical lifecycle of how LaraKube achieves this.

---

## Phase 1: Blueprint Preparation (The Developer)

You shouldn't bundle your `production` environment because your SaaS might rely on managed databases (like AWS RDS) or a shared [Plex Commons](../architecture/shared-storage.md). An air-gapped delivery must be 100% self-sufficient.

Create an environment specifically for the bundle:
```bash
larakube env:add airgap
```

When selecting components, choose a **Standalone** architecture. Include your own Database, Redis, and MinIO components. This ensures your Kustomize blueprint (`.larakube.json`) is fully equipped to run autonomously.

---

## Phase 2: Compiling the Kit (`bundle:build`)

When you are ready to ship the release, run the build command and specify the *client's* hardware architecture (e.g., `amd64` for standard Intel servers):

```bash
larakube bundle:build airgap --arch=amd64
```

Here is exactly what LaraKube does under the hood during this step:
1. **Code Compilation:** It builds your Laravel code into a production-ready Docker image.
2. **Dependency Scraping:** It scrapes your `.larakube.json` and downloads the official Docker images for your database, Traefik, and Redis.
3. **Tarball Generation:** It saves every Docker image as a flat `.tar` file in the `images/` directory.
4. **Manifest Extraction:** It extracts your Kustomize YAML templates to `manifests/`.
5. **K3s Offline Artifacts:** It securely downloads the official `k3s` binary, `k3s-install.sh`, and `k3s-airgap-images.tar` directly from GitHub.
6. **The Wizard:** Finally, it copies the actual `larakube` CLI binary into the folder.

The output is a single folder `dist/<app>-airgap-amd64-bundle/`. You zip this up, put it on a USB stick, and hand it to the client. **Your raw source code is protected inside the Docker image.**

---

## Phase 3: The End-Client Installation (`bundle:install`)

The client plugs the USB stick into their offline Ubuntu server. They can optionally place a custom `.env` file in the folder if they need to provide proprietary API keys (like `STRIPE_SECRET`).

They run a single command:
```bash
sudo ./larakube bundle:install --env-file=.env
```

Here is the exact sequence of events that the generic `larakube` binary executes on the client's machine:

### 1. Pre-Flight Checks
The installer verifies that foundational Linux utilities (`openssl`, `curl`, `tar`) are present to ensure it won't fail halfway through the installation.

### 2. Offline Kubernetes Bootstrap
It detects if Kubernetes is running. If not, it copies the bundled K3s binaries to system paths and executes the official installer using the `INSTALL_K3S_SKIP_DOWNLOAD=true` flag, securely bootstrapping a single-node cluster without touching the internet.

### 3. Containerd Hydration
It loops through your `images/` directory and executes `k3s ctr images import` on every `.tar` file. This pre-loads your app, database, and Traefik directly into K3s, entirely bypassing Docker Hub.

### 4. Dynamic Credentials & Environment Merging
It securely generates cryptographically strong, unique passwords for this specific installation (e.g., `DB_PASSWORD`, `MINIO_SECRET_KEY`). It intelligently merges these with any keys the client provided in their `.env` file, prioritizing the client's keys.

### 5. Hostname Prompting
It pauses and asks the client what domains or IP addresses the app will run on internally (e.g., `hospital.internal`, `s3.hospital.internal`). 

### 6. On-Site TLS Generation
Because Let's Encrypt cannot function without the internet, the CLI dynamically mints a custom **Certificate Authority (CA)** on the server. It then generates an SSL Server Certificate containing **Subject Alternative Names (SANs)** for all the domains the client requested. 

### 7. Traefik Deployment & Rollout
It injects the newly minted certificates and merged environment variables into Kubernetes as Secrets and ConfigMaps. Finally, it deploys Traefik and executes `kubectl apply -k manifests/overlays/airgap`, spinning up your application.

---

### The Result
The wizard finishes by providing the client with the path to the generated `ca.crt`. They install that CA to their local IT trust store, and your application is now running securely over HTTPS on an entirely air-gapped machine.

---

## Flags & Recovery Options

### `--swap=<size>` — Prevent OOM Crashes on 1 GB Servers

1 GB VPS instances will frequently OOM-kill k3s during startup when image import and Kubernetes initialisation run concurrently. The `--swap` flag allocates a swap file **before** the heavy work begins:

```bash
sudo ./larakube bundle:install --swap=1G
```

This runs `fallocate`, `mkswap`, and `swapon` and permanently registers the file in `/etc/fstab`. If `/swapfile` already exists the step is skipped safely, so re-running the command is harmless.

:::tip
Always use `--swap=1G` on any server with 1 GB of RAM. On 2 GB+ servers it is optional but still reduces the risk of transient OOM spikes during the initial rollout.
:::

---

### `--skip-images` — Fast Re-configuration

Importing the Docker image tarballs into containerd is the slowest part of the install (it can take several minutes). If you made a typo during hostname configuration (e.g., a blank Reverb URL) you can re-run the entire prompt wizard **without** re-importing images:

```bash
sudo ./larakube bundle:install --skip-images
```

This skips straight to secrets generation, hostname prompting, and certificate regeneration — so you can fix a configuration mistake in seconds rather than minutes.

---

## How Image Tags Work (No More Collisions)

Before v0.18.27, both local dev images and production bundle images were tagged `:latest`. Building a bundle locally would overwrite the `:latest` tag on your development Docker daemon, instantly crashing your running local pods.

LaraKube now uses **isolated tags** via Kustomize `images:` rewrite blocks:

| Context | Image tag at apply time |
|---------|------------------------|
| Local k3d / k3s | `app:local` |
| Air-gapped bundle | `app:airgap-latest` (or `app:{env}-latest`) |
| Production (registry push) | pulled by digest |

`larakube up` builds and sideloads `app:local`. `bundle:build` builds `app:airgap-latest`. The two tags can coexist on the same machine without interference.
