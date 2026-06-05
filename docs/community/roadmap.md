---
sidebar_position: 3
title: Project Roadmap
description: What LaraKube ships today and what's planned next — per-environment blueprints, managed-cluster support, the Plex shared-services tier, multi-registry publishing, and GitLab CI.
---
# 🗺️ Project Roadmap

LaraKube is an ecosystem built on three pillars: the **CLI** (the engine), the **Console** (the brain), and the **Docs** (the map). This page is an honest snapshot — what's shipped, what's designed and coming next, and the longer-term vision. Items in "Next up" have written designs; dates are intentionally loose because we'd rather ship right than ship on a calendar.

---

## 🟢 Shipped — Foundations

*The cost-effective, single-VPS path, end to end — plus the schema that lets one blueprint grow.*

- [x] **CLI**: Zero-host-dependency orchestration engine (builds, manifests, deploys).
- [x] **CLI**: The **Single-Node Hero** path — provision a $6–12 VPS, deploy, and GitOps via GitHub Actions.
- [x] **CLI**: **Per-environment blueprint** — each environment sets its own deployment strategy (`single-node` / `multi-node-ha`), ingress (Traefik / Nginx / AWS ALB), managed services, hostnames, and cloud connection.
- [x] **CLI**: **Managed-cluster overlay knobs** — namespace override, ServiceAccount + IRSA annotations, image-pull-secret control, and ingress-annotation passthrough, so generated overlays drop into EKS / GKE / AKS / DOKS.
- [x] **CLI**: **Two apps, one server** — multiple projects on a single node, isolated by namespace (see [Two Apps, One Server](../deployment/multiple-projects)).
- [x] **CLI**: **Portable** CLI-free wrapper so teammates can run the lifecycle without installing the binary.
- [x] **CLI — Plex** 🏘️: multiple apps **share** one Commons — a Postgres *or* MySQL/MariaDB database, Redis, Meilisearch, and S3 (SeaweedFS *or* MinIO) — each tenant getting its own isolated database, login, Redis logical DB, and bucket. Commands: `plex:init | plex:join | plex:status | plex:leave | plex:remove | plex:destroy | plex:export`. *Validated on a single-node VPS via **both** manual `larakube cloud:deploy` **and** GitHub Actions; multi-node (DOKS) is still being validated (see "Next up").*
- [x] **CLI — Namespace-scoped deploy credentials** 🔐: both `larakube cloud:deploy` and the GitHub Actions workflow deploy as a per-app, per-environment `deployer` ServiceAccount locked to its own namespace — your admin kubeconfig never leaves your machine, and CI holds only a namespace-scoped token. *Validated on a single-node VPS via both manual deploy and GitHub Actions (see [Surgical Credentials](../deployment/surgical-credentials)).*
- [x] **CLI — Server hardening**: `cloud:provision` hardens the box (UFW default-deny, fail2ban, automatic security updates, key-only SSH, and a guarded disable-remote-root-login); `cloud:harden` re-applies it to an already-provisioned server.
- [x] **CLI — Per-environment registry**: publish each environment's image to **GHCR** or **Docker Hub**, driving both `cloud:deploy`'s registry push and the generated GitHub Actions workflow. *(AWS ECR / Google Artifact Registry / custom registries are next up.)*
- [x] **Console**: High-fidelity Kubernetes Control Plane (Filament).
- [x] **Docs**: Linear learning path, [Blueprint Anatomy](../architecture/blueprint-anatomy), and the [Scaling Journey](../deployment/scaling-journey).

---

## 🟡 Next up — Planned (designs written)

*Closing the gap from "single VPS" to "any cluster, shared or isolated." These have specs and are the active focus.*

- [ ] **CLI — Plex on multi-node** 🏘️: [Plex](../deployment/multiple-projects#going-further-plex) is validated on a single-node VPS via both manual `larakube cloud:deploy` and GitHub Actions; running the shared Commons across a multi-node cluster (DOKS) is the remaining validation.
- [ ] **CLI — DigitalOcean Kubernetes (DOKS) end-to-end**: the tooling shipped in v0.14.0 — `cloud:provision:doks` (Traefik + LoadBalancer IP), managed-cluster identity via `cloud.context`, and per-env `storageClass` — but a clean managed multi-node deploy is still being validated end-to-end.
- [ ] **CLI — More registries**: extend per-environment publishing to **AWS ECR, Google Artifact Registry, and custom registries** (GHCR and Docker Hub already ship).
- [ ] **CLI — GitLab CI/CD**: generate a `.gitlab-ci.yml` pipeline alongside the existing GitHub Actions workflow.
- [ ] **CLI / Console — RBAC teammate access**: scoped cluster access via a per-person kubeconfig + role presets (admin / read-only / single-namespace), replacing SSH logins for real clusters. *(The namespace-scoped ServiceAccount machinery from v0.14.0 is the foundation for this.)*

---

## 🔵 Later — Longer-term vision

*Bigger bets, once the foundation above is solid.*

- [ ] **CLI**: Autoscaling (Horizontal Pod Autoscaler) for production workloads.
- [ ] **Console**: Multi-cluster fleet management from one dashboard.
- [ ] **Console**: Real-time Prometheus / Grafana monitoring built in.
- [ ] **Security**: Automated security audits of production manifests.
- [ ] **Ecosystem**: A marketplace for specialized "Masterpiece Blueprints."

---

### 💡 Suggest a feature
LaraKube is built for the community. If you have an idea that would make your life easier as a Laravel Artisan, please open an issue on the [LaraKube CLI GitHub](https://github.com/luchavez-technologies/larakube-cli).
