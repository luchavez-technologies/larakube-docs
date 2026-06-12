---
sidebar_position: 8
title: Commons Resource Tuning
description: Adjust memory limits and storage sizes for Plex Commons services (MariaDB, Redis, SeaweedFS, etc.) without re-running plex:init.
---
# ⚙️ Commons Resource Tuning (`plex:resources`)

The **`plex:resources`** command lets you raise or lower the memory limit and storage allocation of any Commons service — without re-running `plex:init` or touching the cluster by hand. It reads the live spec, prompts you to adjust, re-applies the Commons manifest, and waits for the rollout.

This is the Commons counterpart to [`larakube resources`](../commands/management#resources), which tunes your **app pods** (web, horizon, reverb). Use `plex:resources` when a Commons service is OOMing, when you've added new tenants and MariaDB needs more headroom, or when you need to grow a storage PVC.

---

## Usage

```bash
larakube plex:resources [environment] [--context=<ctx>]
```

| Argument | Default | Description |
|---|---|---|
| `environment` | `production` | Which cloud environment's Commons to target |
| `--context` | auto | Override the kube-context (defaults to the project's env context) |

Run from inside any LaraKube CLI project (or outside one — you'll be prompted to pick a context).

---

## The flow

```
┌─────────────────────────────────────────┐
│  Service     │  Memory Limit  │  Storage │
├─────────────────────────────────────────┤
│  mariadb     │  1Gi           │  10Gi    │
│  redis       │  128Mi         │  —       │
│  seaweedfs   │  512Mi         │  10Gi    │
└─────────────────────────────────────────┘

Which Commons service do you want to configure?
> mariadb

What do you want to do with 'mariadb'?
> Set or update resources

Memory Limit  [leave blank to keep current (1Gi)]: 2Gi
Storage Size (PVC)  [leave blank to keep current (10Gi)]:

✅ Applying updated Commons manifests for 'mariadb'...
✅ Waiting for mariadb to roll out...
✅ Commons 'mariadb' updated successfully.
```

After the update, the table refreshes with the new values.

---

## Defaults

These are the Commons service defaults when `plex:init` first creates the Commons:

| Service | Memory Limit | Storage |
|---|---|---|
| Postgres | 1Gi | 10Gi |
| MySQL / MariaDB | 1Gi | 10Gi |
| Redis | 128Mi | — |
| Meilisearch | 512Mi | 5Gi |
| SeaweedFS | 512Mi | 10Gi |
| MinIO | 512Mi | 10Gi |

Memory limits are **soft ceilings** — a service will be OOM-killed if it exceeds the limit consistently. Storage sizes are Kubernetes PVC requests; **growing a PVC is supported but shrinking requires manual steps**.

:::caution Growing storage PVCs
Increasing a PVC size will succeed on storage classes that support volume expansion (most cloud providers do; k3s local-path does not). Shrinking is never supported by Kubernetes — you must back up, delete the PVC, re-create it smaller, and restore.
:::

---

## Resetting to defaults

Choose **"Reset to Commons defaults"** in the action prompt to revert a service back to its original values from `plex:init`. Useful after over-provisioning on a small node.

---

## Deciding how much to allocate

A rough guide for a **2 GB / 1 CPU node** with two environments (staging + production):

| Commons setup | Typical memory budget | Notes |
|---|---|---|
| MariaDB + Redis + SeaweedFS | ~650Mi total | Fits alongside 6 app pods (staging + production) |
| + Meilisearch | ~1.2Gi total | Tight on 2 GB; consider a $24/4 GB node |
| MariaDB alone | ~300Mi | If Redis/S3 are external managed services |

If you're hitting scheduling pressure (`Insufficient memory`), the first levers are:
1. Reduce MariaDB from `1Gi` → `512Mi` limit (fine for dev/staging workloads)
2. Reduce SeaweedFS from `512Mi` → `256Mi` if you're not serving large files
3. Use [`larakube resources staging`](../commands/management#resources) to reduce app pod memory requests

---

## Related

- [`larakube resources`](../commands/management#resources) — tune **app pod** CPU and memory (web, horizon, reverb)
- [Two Environments, One Server](./two-envs-one-server) — staging + production on one Plex node
- [Two Apps, One Server](./multiple-projects) — multiple repos sharing one Commons
