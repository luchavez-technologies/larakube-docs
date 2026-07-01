---
sidebar_position: 4
title: Metrics & Monitoring
description: Deploy a cluster-wide Prometheus, Grafana, and Loki stack with monitor:init, then auto-wire per-service exporters for MySQL, PostgreSQL, and Redis on every larakube up.
---
# Metrics & Monitoring

[Service logs](./logs.md) tell you what one pod is doing right now. **Monitoring** tells you what the whole cluster has been doing over time — request rates, query latency, cache hit ratios, pod restarts, and a searchable history of every log line.

LaraKube CLI ships this as one opt-in command. It deploys a complete, pre-wired observability stack into the shared `larakube-shared` namespace, then auto-attaches per-service exporters to your app on every `larakube up`.

## The Stack

`monitor:init` installs five components into `larakube-shared`:

| Component | Role |
| --- | --- |
| **Prometheus** | Scrapes and stores time-series metrics. |
| **Grafana** | Dashboards and data-source UI (the front door). |
| **Loki** | Stores logs, queryable from Grafana like metrics. |
| **Promtail** | A DaemonSet that ships every pod's logs into Loki. |
| **kube-state-metrics** | Exposes Kubernetes object state (deployments, pods, restarts) to Prometheus. |

Prometheus and Loki are pre-configured as Grafana data sources, so there's nothing to wire up by hand — open Grafana and the data is already flowing.

:::note Cluster-wide, not per-project
The stack lives in `larakube-shared` and observes **every** project on the cluster. You install it once per cluster, not once per app. This mirrors how Mailpit and the Traefik dashboard are shared infrastructure rather than project resources.
:::

## Installing Locally

```bash
larakube monitor:init
```

This brings the stack up and prints the access details:

```
✅ Monitoring stack is live.

  Grafana:            https://grafana.kube  admin / 7f3c9a1b…
  Prometheus:         prometheus.larakube-shared.svc.cluster.local:9090  (in-cluster)
  Loki:               loki.larakube-shared.svc.cluster.local:3100  (in-cluster)
```

- **Grafana** is published at `grafana.{your-dev-tld}` — `grafana.kube` by default, or `grafana.test`/`grafana.localhost` if you've changed your TLD with `larakube config:tld`.
- The **admin password** is generated on first install and stored in the `grafana-admin` Secret. Re-running `monitor:init` reuses it, so the password is stable across upgrades.
- Prometheus and Loki are **in-cluster only** — there's no public ingress for them; you reach them through Grafana.

## Per-Service Exporters

The stack above gives you cluster and log visibility. To get **database and cache metrics**, LaraKube CLI attaches a Prometheus exporter sidecar to your project — automatically, on every `larakube up`:

| Service | Exporter |
| --- | --- |
| MySQL / MariaDB | `mysqld-exporter` (port 9104) |
| PostgreSQL | `postgres-exporter` (port 9187) |
| Redis | `redis_exporter` (port 9121) |

This is **demand-driven and opt-in by presence**: exporters are wired only when the monitoring stack is actually running. If you never run `monitor:init`, `larakube up` does no monitoring work at all. Install the stack and your existing apps pick up exporters on their next `up` — no reconfiguration.

:::tip SQLite, Memcached, and the `database` cache get no exporter
There's no meaningful metrics exporter for SQLite or Memcached, and the `database` cache driver is just rows in your app's own database — already covered by the DB exporter. These are skipped silently.
:::

## Monitoring a Cloud Environment

Monitoring is opt-in **per environment** — you might want it on `production` but not on `staging`. So you install it directly against the target cluster's context:

```bash
larakube monitor:init --context my-prod-cluster --env production
```

Because a cloud cluster has no local dev TLD, `monitor:init` **prompts for the Grafana host** the first time:

```
What host should Grafana use in 'production'?
> grafana.example.com
```

The answer is persisted to your project's `.larakube.json` under that environment's `hosts` map, so:

- Re-running the command **reuses** the saved host (no re-prompt).
- Other tooling reads the same map — host resolution is data-driven, not hard-coded.

Point that DNS record at your cluster and add TLS like any other ingress host. From then on, every [cloud deploy](../deployment/overview.md) auto-wires the same DB/cache exporters into the deployed namespace, exactly as `up` does locally.

:::note Skip the prompt in CI
Pass `--domain` to supply the cluster domain non-interactively — `--domain example.com` resolves to `grafana.example.com`. This bypasses both the prompt and the `.larakube.json` write, which is what you want in an automated pipeline.
:::

## Changing the TLD

Grafana's local ingress carries your dev TLD, so it's re-pointed automatically on the next `larakube up` after a `larakube config:tld` change — the same single-propagation rule that governs every shared host. You don't need to reinstall the stack; just run `up`.

## Removing the Stack

```bash
larakube monitor:init --remove
```

This tears down Prometheus, Grafana, Loki, Promtail, and kube-state-metrics — plus their PVCs and cluster RBAC — from `larakube-shared`. Your projects are untouched; their exporters simply stop being reconciled on the next `up` (since the stack is no longer present).

## Command Reference

```bash
larakube monitor:init [options]
```

| Option | Description |
| --- | --- |
| `--context=` | Target a specific kube-context. Defaults to your current context. |
| `--env=` | Which `.larakube.json` environment this install is for (default: `local`). A non-local env prompts for and persists the Grafana host. |
| `--domain=` | Raw override for the Grafana cluster domain (`example.com` → `grafana.example.com`). Skips the prompt and the config write. |
| `--remove` | Tear the stack down from `larakube-shared`. |
