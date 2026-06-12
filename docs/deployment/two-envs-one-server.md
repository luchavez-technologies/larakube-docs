---
sidebar_position: 7
title: Two Environments, One Server
description: Run staging and production of the same app on a single VPS using Plex — each environment gets its own namespace, database, Redis logical DB, and S3 bucket.
---
# 🔀 Two Environments, One Server

You don't need a separate server for staging. With **Plex**, a single VPS can host both `staging` and `production` of the same app — fully isolated at every layer — driven by two branches of the same GitHub repository.

This is distinct from [Two Apps, One Server](./multiple-projects): here you have **one repo, one app, two branches** deploying to separate environments on one node. Both environments share a single Plex Commons (MariaDB, Redis, SeaweedFS, etc.) but each gets its own isolated database, Redis logical DB, and S3 bucket.

---

## 💡 How isolation works

LaraKube CLI generates an **environment-aware tenant identifier** for each `plex:join`. For a project named `my-app`:

| Environment | Tenant ID | Namespace | Redis DB |
|---|---|---|---|
| `production` | `my_app` | `my-app-production` | 0 |
| `staging` | `my_app_staging` | `my-app-staging` | 1 |

Every resource Plex provisions for a tenant is scoped to that identifier — so staging never touches production's data and both can live on the same Commons.

---

## 🛠 The setup

### 1. Provision the server and init the Commons

```bash
larakube cloud:provision           # once per server
larakube plex:init                 # pick services: MariaDB, Redis, SeaweedFS, etc.
```

### 2. Join production

In your app's project directory, configure and join production first:

```bash
larakube cloud:configure           # set server IP, web host
larakube plex:join production      # provisions: DB plex_react / Redis DB 0 / bucket plex_react
larakube cloud:configure:gha production
```

Push to `main`. Your production environment deploys.

### 3. Add staging

With production running, add a staging environment to the same project:

```bash
larakube env staging               # add staging env, set staging.example.com host
larakube plex:join staging         # provisions: DB plex_react_staging / Redis DB 1 / bucket plex_react-staging
larakube cloud:configure:gha staging
```

Push to `develop`. Staging deploys alongside production on the same node.

### 4. Verify both tenants

```bash
larakube plex:status
```

You should see both tenants registered with separate allocations:

```
Tenants (2):
  my_app (this app — production)
    ├─ Database: my_app (mariadb)
    ├─ Redis DB: 0
    └─ S3 Bucket: my-app
  my_app_staging
    ├─ Database: my_app_staging (mariadb)
    ├─ Redis DB: 1
    └─ S3 Bucket: my-app-staging
```

---

## 🔀 Branch-to-environment mapping

Configure each GHA workflow to trigger on its own branch:

| Branch | Environment | Workflow trigger |
|---|---|---|
| `main` | `production` | `branches: ["main"]` |
| `develop` | `staging` | `branches: ["develop"]` |

`larakube cloud:configure:gha staging` automatically wires the staging workflow to `develop` (or whatever branch you specify during setup).

---

## 📊 Resource planning

On a 2 GB / 1 CPU node with two environments, resource requests matter. LaraKube CLI defaults are tuned for this:

| Resource | Default request | Default limit |
|---|---|---|
| CPU per app pod | 50m | 1 CPU |
| Memory per app pod | 128Mi | 1Gi |

With two environments × 3 app pods each (web + horizon + reverb) = 6 app pods:

- **CPU requests**: 6 × 50m = 300m (plus ~250m Commons + ~200m kube-system/Traefik ≈ 750m / 1000m) ✅
- **Memory requests**: 6 × 128Mi = 768Mi (plus ~400Mi Commons + ~200Mi system ≈ 1.4Gi / 2Gi) ✅

Both environments fit comfortably on a $12/2GB node.

:::tip Tuning for a heavier Commons
If your Commons services need more headroom (e.g. MariaDB serving many tenant databases), use `larakube plex:resources` to raise their memory limits without touching app pods:

```bash
larakube plex:resources production
```

See [Commons Resource Tuning](./plex-resources) for details.
:::

:::caution Reducing app resources
If pods hit scheduling pressure (e.g. `Insufficient cpu`), use `larakube resources <env>` to lower per-pod CPU requests — 50m is the default, but you can drop lower on a constrained node. Remember: requests are scheduling minimums, not hard caps.
:::

---

## 🔒 What's isolated, what's shared

| Concern | Status |
|---|---|
| App pods (web, horizon, reverb) | **Isolated** — separate namespace per env |
| Database | **Isolated** — separate DB + login on the shared engine |
| Redis | **Isolated** — separate logical DB (DB 0 / DB 1 / …) |
| S3 bucket | **Isolated** — separate bucket per tenant |
| TLS certificates | **Isolated** — per domain, issued independently |
| Deploy pipelines | **Isolated** — separate GHA workflow + branch |
| Commons services (MariaDB, Redis, SeaweedFS) | **Shared** — one pod set, multiple tenants |
| Kubernetes node + Traefik | **Shared** — one cluster |

---

## 🔧 Leaving an environment

To remove staging without affecting production:

```bash
larakube plex:leave staging
```

This drops the tenant's database, Redis DB, and bucket (with a confirmation prompt) and removes the tenant entry from the Commons registry. Production is unaffected.

---

## ➡️ Going further

Once your single-node two-env setup is proven, the natural graduation path is:

- **Separate servers per environment** — `larakube cloud:provision` on a second VPS and `plex:init` there for production, keeping staging on the original.
- **Managed Kubernetes (DOKS)** — move production to a multi-node cluster; staging stays single-node.
- **Managed databases** — mark `mysql` / `mariadb` as `managed` in the production environment to point at DigitalOcean Managed MySQL, freeing up RAM for app pods.

See [The Scaling Journey](./scaling-journey) for where each step fits.
