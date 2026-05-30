---
sidebar_position: 6
title: Two Apps, One Server
description: Run multiple independent LaraKube projects on a single VPS — separate GitHub repos, separate namespaces, one shared node. No extra commands required.
---
# 🏘️ Two Apps, One Server

You don't need a server per project. Two (or more) independent LaraKube apps — **separate GitHub repositories** — can live on a single VPS, each isolated in its own Kubernetes namespace, each on its own domain. This is the natural next step after the [Single-Node Hero](../architecture/single-node-hero) strategy: same cheap box, more than one app.

This page covers the **simple, supported-today** approach: each project keeps its own data services (or points at an external managed database). For the more advanced "share one Postgres/Redis across projects to save RAM" model, see the future [Plex](#going-further-plex) note at the end.

## 💡 Why this just works

LaraKube was multi-tenant-friendly from the start, because of three properties you already rely on:

1. **Namespaces are per-project-per-environment.** Every project deploys into `{name}-{environment}` (e.g. `blog-production`, `shop-production`). Two repos never collide at the Kubernetes level.
2. **Traefik routes by hostname.** The ingress controller is cluster-wide and dispatches traffic by the `Host` header. Each app keeps its own domain; Traefik sends `blog.com` to one namespace and `shop.com` to the other.
3. **Provisioning preps the box, not the project.** `larakube cloud:provision` installs K3s, swap, and Traefik on the VPS without baking in any single app. A second project deploying to the same IP simply reuses the cluster.

Deploying a second app **cannot** disturb the first: every operation LaraKube runs during a deploy is scoped to that project's namespace.

## 🛠 The flow

### 1. Provision the server once

Point a fresh VPS at LaraKube a single time:

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
  1. **Use an external managed database.** Mark the service as `managed` in `environments.production` and point the host at a provider endpoint (e.g. DigitalOcean Managed Database). LaraKube then skips deploying that pod entirely. See [Blueprint Anatomy](../architecture/blueprint-anatomy#-environments).
  2. **Bump the droplet** to 4GB, or wait for a Plex (below).

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

## 🏘️ Going further: a Plex {#going-further-plex}

The approach above keeps each app's data services separate (or external). A future LaraKube tier — **Plex** (`larakube plex`) — will let multiple apps **share** a single Postgres/Redis instance on the node, each with its own isolated database and credentials (exactly like several apps sharing one managed database). That reclaims the RAM wasted by running duplicate data services and pushes the $12 box further. See [The Scaling Journey](./scaling-journey) for where this fits.

Until then, "Two Apps, One Server" with lightweight apps or an external managed database is the recommended, fully-supported path.
