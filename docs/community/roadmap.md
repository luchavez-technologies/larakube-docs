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
- [x] **CLI — Plex** 🏘️: multiple apps **share** one Commons — a Postgres *or* MySQL/MariaDB database, Redis, Meilisearch, and S3 (SeaweedFS *or* MinIO) — each tenant getting its own isolated database, login, Redis logical DB, and bucket. Commands: `plex:init | plex:join | plex:status | plex:leave | plex:remove | plex:destroy | plex:export`. *Verified on a single-node VPS via manual `larakube cloud:deploy`; the GHA-triggered and multi-node paths are still being validated (see "Next up").*
- [x] **Console**: High-fidelity Kubernetes Control Plane (Filament).
- [x] **Docs**: Linear learning path, [Blueprint Anatomy](../architecture/blueprint-anatomy), and the [Scaling Journey](../deployment/scaling-journey).

---

## 🟡 Next up — Planned (designs written)

*Closing the gap from "single VPS" to "any cluster, shared or isolated." These have specs and are the active focus.*

- [ ] **CLI — Plex on GHA + multi-node** 🏘️: the [Plex](../deployment/multiple-projects#going-further-plex) commands are verified today on a single-node VPS via manual `larakube cloud:deploy`; validating GHA-triggered deploys and multi-node clusters (DOKS) for the shared Commons is the active follow-up.
- [ ] **CLI — DigitalOcean Kubernetes (DOKS)**: a clean managed multi-node deploy path, with storage-class control and cert-manager TLS for managed clusters.
- [ ] **CLI — Per-environment container registry**: publish each environment's image to **GHCR, Docker Hub, AWS ECR, Google Artifact Registry, or a custom registry** (e.g. local builds locally, staging → GHCR, production → ECR).
- [ ] **CLI — GitLab CI/CD**: generate a `.gitlab-ci.yml` pipeline alongside the existing GitHub Actions workflow.
- [ ] **CLI / Console — RBAC teammate access**: scoped cluster access via a per-person kubeconfig + role presets (admin / read-only / single-namespace), replacing SSH logins for real clusters.

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
