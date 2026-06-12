---
sidebar_position: 6
title: Two Apps, One Server
description: Run multiple independent LaraKube CLI projects on a single VPS — separate GitHub repos, separate namespaces, one shared node. No extra commands required.
---
# 🏘️ Two Apps, One Server

You don't need a server per project. Two (or more) independent LaraKube CLI apps — **separate GitHub repositories** — can live on a single VPS, each isolated in its own Kubernetes namespace, each on its own domain. This is the natural next step after the [Single-Node Hero](../architecture/single-node-hero) strategy: same cheap box, more than one app.

This page covers the **simplest** approach: each project keeps its own data services (or points at an external managed database). For the more advanced "share one set of services across projects to save RAM" model, see the [Plex](#going-further-plex) section at the end.

## 💡 Why this just works

LaraKube CLI was multi-tenant-friendly from the start, because of three properties you already rely on:

1. **Namespaces are per-project-per-environment.** Every project deploys into `{name}-{environment}` (e.g. `blog-production`, `shop-production`). Two repos never collide at the Kubernetes level.
2. **Traefik routes by hostname.** The ingress controller is cluster-wide and dispatches traffic by the `Host` header. Each app keeps its own domain; Traefik sends `blog.com` to one namespace and `shop.com` to the other.
3. **Provisioning preps the box, not the project.** `larakube cloud:provision` installs K3s, swap, and Traefik on the VPS without baking in any single app. A second project deploying to the same IP simply reuses the cluster.

Deploying a second app **cannot** disturb the first: every operation LaraKube CLI runs during a deploy is scoped to that project's namespace.

## 🛠 The flow

### 1. Provision the server once

Point a fresh VPS at LaraKube CLI a single time:

```bash
larakube cloud:provision
```

This is **idempotent** — re-running it on an already-provisioned box is safe and won't touch your running apps. You only truly need it once per server, but running it again (e.g. while setting up the second project) does no harm.

### 2. Point each domain at the same IP

In your DNS provider, create records for **both** apps pointing at the **same** VPS IP:

```
blog.com        A     203.0.113.10
shop.com        A     203.0.113.10
```

Traefik will sort out which app each request belongs to based on the hostname in your blueprint's `environments.production.hosts.web`.

### 3. Configure and deploy each repo independently

From **each** project's repository, run the normal cloud setup pointing at the **same** server:

```bash
# In the blog repo
larakube cloud:configure       # set the server IP, SSH, and web host
larakube gha:configure         # wire up GitHub Actions secrets

# In the shop repo — same server IP, different domain
larakube cloud:configure
larakube gha:configure
```

Each repo gets its own GitHub Actions workflow (`.github/workflows/larakube-deploy-production.yml`). Pushing to the deploy branch of either repo deploys **only that app**, into **only its namespace**, on the shared cluster. The two pipelines are completely independent and never step on each other.

That's it. `blog-production` and `shop-production` now coexist on one node.

## 📊 Will it fit? Capacity reality

A single small VPS has a hard RAM ceiling, and this is the part to plan around honestly.

| Tier | RAM | Realistic load |
|---|---|---|
| $6/mo | 1GB | One modest app |
| $12/mo | 2GB | **Two lightweight apps**, or one app + a small companion |
| $24/mo | 4GB | Two-three apps with their own data services |

The deciding factor is **how heavy each app's data services are**:

- **Lightweight apps fit comfortably.** A FrankenPHP + Inertia/React + **SQLite** app has no database pod and no Redis pod — just the web process. Two of those sit happily on a $12/2GB box.
- **Data-heavy apps need a plan.** If each app wants its own Postgres + Redis + Meilisearch, two full stacks will blow past 2GB. Two good options:
  1. **Use an external managed database.** Mark the service as `managed` in `environments.production` and point the host at a provider endpoint (e.g. DigitalOcean Managed Database). LaraKube CLI then skips deploying that pod entirely. See [Blueprint Anatomy](../architecture/blueprint-anatomy#-environments).
  2. **Bump the droplet** to 4GB, or share one set of services across the apps with **[Plex](#going-further-plex)** (below).

When in doubt, keep at least one of the two apps on the lightweight (SQLite/file-cache) profile.

## 🔒 What's isolated, what's shared

| Concern | Status |
|---|---|
| Application pods, services, configmaps, secrets | **Isolated** — separate namespace per app |
| Persistent volumes | **Isolated** — named per app |
| Domains / TLS certificates | **Isolated** — per host, issued independently by ACME |
| Deploy pipelines | **Isolated** — separate GitHub repo + workflow each |
| The Kubernetes node itself & Traefik | **Shared** — one control plane, one ingress |
| Raw CPU / RAM | **Shared** — this is why capacity planning matters |

Because the node and its RAM are shared, a runaway app *can* affect its neighbor. For a hobbyist running their own handful of apps that's an acceptable trade; if you need hard resource fences between apps, that's a feature of the Plex tier.

## 🏘️ Going further: share a Commons with Plex {#going-further-plex}

The approach above keeps each app's data services separate (or external). **Plex** goes one step further: multiple apps **share** a single set of backing services — the **Commons** — on the node, each tenant getting its own isolated database, login, Redis logical DB, and S3 bucket (exactly like several apps sharing one managed database). That reclaims the RAM wasted by running duplicate data services and pushes the cheap box further. See [The Scaling Journey](./scaling-journey) for where this fits.

The Commons can run any mix of:

- a database — **Postgres**, **MySQL**, or **MariaDB**
- **Redis**
- **Meilisearch**
- S3-compatible object storage — **SeaweedFS** or **MinIO**

It's **demand-driven**: each app's blueprint declares its own drivers, and joining provisions only what that app needs (and never tears down a service another tenant still uses).

```bash
# On the server's cluster, stand up (or extend) the Commons:
larakube plex:init                 # pick the services to share; prompts for the cluster context

# From each app's repo, join the Commons — provisions its isolated DB + bucket,
# and rewrites the app's .env to point at the shared services:
larakube plex:join production

larakube plex:status               # see the Commons services and every tenant
larakube plex:leave production     # detach an app (backs up + drops its tenant data)
larakube plex:remove <service>     # drop an unused Commons service (guarded)
```

:::caution Capacity still applies — more so
Sharing services saves RAM versus duplicate stacks, but the Commons pods (a database + Redis + any S3) still live on the node alongside every app. A **1 GB box cannot host a database + Redis + an S3 backend plus app pods** — plan for 2 GB+ and watch the [capacity table](#-will-it-fit-capacity-reality) above.
:::

:::note Verified scope today
Plex is validated end-to-end on a **single-node VPS** — apps sharing a Commons deploy cleanly via **both manual `cloud:deploy` and GitHub Actions** (proven with a React/Inertia app sharing MySQL + Redis + MinIO, on valid Let's Encrypt TLS and production-safe config). Running the Commons across a **multi-node** cluster (e.g. DOKS) is on the [roadmap](../community/roadmap) but not yet validated.
:::
