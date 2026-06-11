---
sidebar_position: 2
title: LaraKube CLI vs Docker Swarm & Spin
description: Why teams running Docker Swarm or Spin are exploring LaraKube CLI — especially for on-premise and air-gapped deployments.
---

# LaraKube CLI vs Docker Swarm & Spin

A practical comparison for teams currently running **Docker Swarm** or **Spin** who are evaluating a move to Kubernetes — particularly for on-premise or air-gapped customer deployments.

---

## The Docker Swarm Situation

Docker Swarm is not dead. Swarm Mode is built into Docker Engine, still receives security and bug fixes, and continues to work reliably for teams that use it — particularly in self-hosted and homelab environments where simplicity matters more than scalability.

The honest picture:

- The **standalone Docker Swarm binary** was deprecated in Docker Engine 26.x, but **Swarm Mode** (the orchestration layer built into Docker Engine) remains available and maintained.[^1]
- New feature investment has shifted to Kubernetes. Swarm Mode is in maintenance, not active development.
- The CNCF's 2023 Annual Survey found that **84% of respondents use Kubernetes in production**.[^3] Swarm remains a practical choice for smaller, stable deployments — just not a growing one.

If Swarm meets your needs today, it is a reasonable choice. The question for on-premise customer deployments is whether it will still meet those needs in three to five years, and whether it can grow with the customer if requirements change. That is where Kubernetes — and LaraKube CLI — makes a stronger case.

---

## LaraKube CLI vs Spin

We have genuine respect for [Spin](https://getspin.pro) by Server Side Up.[^4] It is a well-designed developer experience wrapper around Docker and an excellent choice for teams that want standardised Docker Compose environments. LaraKube CLI even uses Server Side Up's PHP Docker images as its own base.[^5]

The difference is the runtime:

| | Spin | LaraKube CLI |
|---|---|---|
| Runtime | Docker Compose / Swarm | Kubernetes (K3s → managed) |
| Local dev | ✅ Docker Compose | ✅ K3s (same manifests as prod) |
| Air-gapped / on-premise delivery | ❌ | ✅ Self-contained offline bundle |
| VPS → managed Kubernetes migration | ❌ Requires re-architecture | ✅ Same `.larakube.json`, new target |
| Multi-app on one server | Limited | ✅ Plex (shared services tier) |
| Rolling deploys / self-healing pods | Limited | ✅ Native Kubernetes |
| Standard, portable runtime | Docker-specific | ✅ Standard K8s — runs anywhere |
| Long-term investment trajectory | ⚠️ Swarm is de-prioritised | ✅ Kubernetes is the industry standard |

**Spin is the right tool when:** you want a polished local development experience around Docker Compose and your production target is a traditional single-server deployment.

**LaraKube CLI is the right tool when:** your deployment story needs to outlive the tooling — particularly when you are delivering to on-premise customers, air-gapped environments, or when you expect to grow from a single VPS into a multi-node managed cluster.

---

## The On-Premise Case

This is where the gap is most visible.

### Self-Contained Offline Bundles

LaraKube CLI's `bundle:build` command produces a single `.tar.gz` that contains:

- Your compiled application image (with correct per-environment assets baked in at build time)
- All dependency images (database, cache, ingress controller, etc.)
- K3s binaries and airgap images for offline Kubernetes installation
- The Kubernetes manifests
- The LaraKube CLI installer binary

The target server needs **no internet access**. The customer extracts the archive and runs:

```bash
sudo ./larakube bundle:install
```

K3s installs offline, images are imported into containerd, manifests are applied, TLS certificates are generated locally, and the application is live — all without a single outbound network call.

Docker Swarm has no comparable story. On-premise Swarm deployments require either internet access to pull images, a private registry the customer must maintain, or manual scripting that is fragile and customer-specific.

### The Customer Owns the Infrastructure

LaraKube CLI deploys to standard Kubernetes. The customer can:

- Inspect the cluster with any standard `kubectl` tool
- Hand the runbook to any Kubernetes-literate sysadmin
- Migrate to a different Kubernetes distribution without changing their application manifests
- Run `larakube-reset` to wipe and re-install cleanly

There are no proprietary agents, no external control planes, no phone-home requirements.

### From $6 VPS to Enterprise Cluster — No Re-Architecture

A LaraKube CLI project is defined by a single `.larakube.json` file. The same file drives:

- Local development (K3s)
- Single-VPS deployment (K3s via SSH)
- Managed Kubernetes (DigitalOcean, Civo, EKS, GKE)
- Air-gapped on-premise (offline bundle)

When an on-premise customer outgrows their single server, they do not start over. They add nodes and point LaraKube CLI at a multi-node cluster. The application manifests, CI/CD workflows, and deployment scripts are unchanged.

### ARM Support

On-premise hardware is increasingly ARM-based (Raspberry Pi clusters, Ampere servers, edge devices). LaraKube CLI's `bundle:build --arch=arm64` cross-compiles the application image on a developer's Mac and produces a bundle ready for ARM servers — no ARM build machine required.

---

## Summary

If you are currently using Docker Swarm and have on-premise customers:

1. **Swarm is a runtime without a future.** Your customers will be running whatever you deploy for years. Building on Kubernetes now avoids a painful migration later.

2. **LaraKube CLI gives you a one-command offline installer.** No private registry. No internet dependency. One tar.gz, one command, running application.

3. **The customer owns a standard, auditable stack.** Standard Kubernetes, standard `kubectl`, no vendor lock-in.

4. **The same config file scales from a single VPS to a managed cluster.** You are not designing two different deployment architectures for "small" vs "large" customers.

---

[^1]: Docker Engine Deprecations — standalone Swarm support: https://docs.docker.com/engine/deprecated/
[^3]: CNCF Annual Survey 2023 — Kubernetes production adoption: https://www.cncf.io/reports/cncf-annual-survey-2023/
[^4]: Server Side Up Spin: https://getspin.pro
[^5]: Server Side Up Docker PHP images — the base images LaraKube CLI builds on: https://serversideup.net/open-source/docker-php/
