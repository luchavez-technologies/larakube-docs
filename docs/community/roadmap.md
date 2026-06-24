---
sidebar_position: 3
title: Project Roadmap
description: What LaraKube CLI ships today and what's planned next — per-environment blueprints, managed-cluster support, the Plex shared-services tier, multi-registry publishing, and GitLab CI.
---
# 🗺️ Project Roadmap

LaraKube CLI is an ecosystem built on three pillars: the **CLI** (the engine), the **Console** (the brain), and the **Docs** (the map). This page is an honest snapshot — what's shipped, what's designed and coming next, and the longer-term vision. Items in "Next up" have written designs; dates are intentionally loose because we'd rather ship right than ship on a calendar.

---

## 🟢 Shipped — Foundations

*The cost-effective, single-VPS path, end to end — plus the schema that lets one blueprint grow.*

- [x] **CLI**: Zero-host-dependency orchestration engine (builds, manifests, deploys).
- [x] **CLI**: The **Single-Node Hero** path — provision a $6–12 VPS, deploy, and GitOps via GitHub Actions.
- [x] **CLI**: **Per-environment blueprint** — each environment sets its own deployment strategy (`single-node` / `multi-node-ha`), ingress (Traefik / Nginx / AWS ALB), managed services, hostnames, and cloud connection.
- [x] **CLI**: **Managed-cluster overlay knobs** — namespace override, ServiceAccount + IRSA annotations, image-pull-secret control, and ingress-annotation passthrough, so generated overlays drop into EKS / GKE / AKS / DOKS.
- [x] **CLI**: **Two apps, one server** — multiple projects on a single node, isolated by namespace (see [Two Apps, One Server](../deployment/multiple-projects)).
- [x] **CLI — Air-Gapped Enterprise Bundles** 📦: compile your entire stack — app image, Kubernetes, Traefik, database, Redis, MinIO, TLS certificates — into a single folder for fully offline, on-premise delivery. `bundle:build` assembles the kit; `bundle:install` runs a guided wizard on the customer's server. Includes `--swap=<size>` for 1 GB VPS stability and `--skip-images` for fast re-configuration without re-importing image tarballs. See [Air-Gapped Bundles](../deployment/airgapped-bundles).
- [x] **CLI**: **Portable** CLI-free wrapper so teammates can run the lifecycle without installing the binary.
- [x] **CLI — Plex** 🏘️: multiple apps **share** one Commons — a Postgres *or* MySQL/MariaDB database, Redis, Meilisearch, and S3 (SeaweedFS *or* MinIO) — each tenant getting its own isolated database, login, Redis logical DB, and bucket. Commands: `plex:init | plex:join | plex:status | plex:leave | plex:remove | plex:destroy | plex:export`. *Validated on a single-node VPS via **both** manual `larakube cloud:deploy` **and** GitHub Actions; multi-node (DOKS) is still being validated (see "Next up").* See [Two Apps, One Server](../deployment/multiple-projects) and [Two Environments, One Server](../deployment/two-envs-one-server).
- [x] **CLI — Multi-environment Plex** 🔀: `staging` and `production` of the same app as separate tenants on one Plex node — environment-aware tenant identifiers, isolated DB + Redis logical DB + S3 bucket per env, separate GHA workflows per branch. *Validated end-to-end on a $12 VPS.* See [Two Environments, One Server](../deployment/two-envs-one-server).
- [x] **CLI — `plex:resources`** ⚙️: interactively tune memory limits and PVC storage sizes for Plex Commons services without re-running `plex:init`. See [Commons Resource Tuning](../deployment/plex-resources).
- [x] **CLI — Namespace-scoped deploy credentials** 🔐: both `larakube cloud:deploy` and the GitHub Actions workflow deploy as a per-app, per-environment `deployer` ServiceAccount locked to its own namespace — your admin kubeconfig never leaves your machine, and CI holds only a namespace-scoped token. *Validated on a single-node VPS via both manual deploy and GitHub Actions (see [Surgical Credentials](../deployment/surgical-credentials)).*
- [x] **CLI — Server hardening**: `cloud:init` hardens the box (UFW default-deny, fail2ban, automatic security updates, key-only SSH, and a guarded disable-remote-root-login); `cloud:harden` re-applies it to an already-provisioned server.
- [x] **CLI — Teammate RBAC** 👥: per-person, namespace-scoped kube access with **no SSH** — `cluster:grant <environment> --name <person> [--read|--edit|--admin]` (built-in `view`/`edit`/`admin`). **Environment-first**: in a project you name an env and it targets that env's namespace *and* its own cluster context (a literal namespace still works standalone). One identity across many apps, instant upgrade/downgrade, `context:import` onboarding, `cluster:users <env>` to see who has access (`--scope` audits a deploy SA's rules), and `cluster:revoke --name` off-boarding. Replaces the old SSH-teammate flow. *(Per-person OIDC/SSO is the longer-term graduation path.)*
- [x] **CLI — Per-environment registry**: publish each environment's image to **GHCR** or **Docker Hub**, driving both `cloud:deploy`'s registry push and the generated GitHub Actions workflow. *(AWS ECR / Google Artifact Registry / custom registries are next up.)*
- [x] **CLI — Multi-node storage strategy** 🗄️: multi-node apps default to **stateless** (uploads on S3/Spaces, sessions/cache on Redis — a Plex Commons supplies both, and `cloud:deploy` warns on anything still local). Apps that need a real shared cross-node folder can opt in with `cloud:init:nfs` + `sharedStorage` (in-cluster NFS → `larakube-nfs` RWX class). *In-cluster NFS is **experimental** — it works on some clusters but not DOKS (mount hangs); see [Shared Storage](../architecture/shared-storage#-storage-across-the-scaling-journey).*
- [x] **Console**: High-fidelity Kubernetes Control Plane (Filament).
- [x] **Docs**: Linear learning path, [Blueprint Anatomy](../architecture/blueprint-anatomy), and the [Scaling Journey](../deployment/scaling-journey).

---

## 🟡 Next up — Planned (designs written)

*Closing the gap from "single VPS" to "any cluster, shared or isolated." These have specs and are the active focus.*

- [ ] **CLI — Plex on multi-node** 🏘️: [Plex](../deployment/multiple-projects#going-further-plex) is validated on a single-node VPS via both manual `larakube cloud:deploy` and GitHub Actions; running the shared Commons across a multi-node cluster (DOKS) is the remaining validation.
- [ ] **CLI — DigitalOcean Kubernetes (DOKS) end-to-end**: the tooling shipped in v0.14.0 — `cloud:init:doks` (Traefik + LoadBalancer IP), managed-cluster identity via `cloud.context`, and per-env `storageClass` — but a clean managed multi-node deploy is still being validated end-to-end.
- [ ] **CLI — More registries**: extend per-environment publishing to **AWS ECR, Google Artifact Registry, and custom registries** (GHCR and Docker Hub already ship).
- [ ] **CLI — GitLab CI/CD**: generate a `.gitlab-ci.yml` pipeline alongside the existing GitHub Actions workflow.

---

## 🔵 Later — Longer-term vision

*Bigger bets, once the foundation above is solid.*

- [ ] **CLI**: Autoscaling (Horizontal Pod Autoscaler) for production workloads.
- [ ] **CLI — Truly-HA shared filesystem**: a `ReadWriteMany` storage class without the single-NFS-pod SPOF — **CephFS / Longhorn / `csi-driver-nfs`** or a managed filer — for teams that need both a shared cross-node folder *and* high availability (today's `cloud:init:nfs` is the experimental, single-pod stopgap).
- [ ] **Console**: Multi-cluster fleet management from one dashboard.
- [ ] **Console**: Real-time Prometheus / Grafana monitoring built in.
- [ ] **Security**: Automated security audits of production manifests.
- [ ] **Ecosystem**: A marketplace for specialized "Masterpiece Blueprints."

---

### 💡 Suggest a feature
LaraKube is built for the community. If you have an idea that would make your life easier as a Laravel Artisan, please open an issue on the [LaraKube CLI GitHub](https://github.com/luchavez-technologies/larakube-cli).
