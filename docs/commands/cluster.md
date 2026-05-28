---
sidebar_position: 5
title: Cluster Lifecycle
description: Manage the underlying local Kubernetes cluster (k3d) with LaraKube's cluster:* commands.
---
# Cluster Lifecycle

These commands manage the **local Kubernetes cluster itself** — the k3d-backed control plane that LaraKube projects deploy into. Project-level commands (`up`, `down`, `stop`, `start`) live inside this cluster; these commands run *one level up* on the cluster itself.

:::tip You usually don't think about these
For day-to-day work, `larakube up` will set up the cluster on first run and reuse it after. These commands are for cluster lifecycle moments: initial provisioning, low-memory cleanup, multi-machine bootstrapping, or a clean restart.
:::

## `cluster:setup`
The "Cluster Installer." Installs and configures a local Kubernetes cluster using k3d (Docker-backed K3s).
- **What it installs**: k3d cluster, Traefik ingress controller, the LaraKube Local CA for wildcard SSL.
- **Idempotent**: Safe to re-run; existing clusters are left alone.
- **First-time setup**: Automatically invoked by `larakube up` if no cluster is detected.

## `cluster:start`
The "Cluster Resume." Resumes the local LaraKube cluster after `cluster:stop`. Brings k3d containers back online without losing data.

## `cluster:stop`
The "Cluster Pause." Pauses the local LaraKube cluster — stops the k3d containers without deleting them. Data (PVCs, configs, images) remains intact.
- **Use when**: You want to free up memory or CPU on your laptop without losing work.
- **Resume with**: `larakube cluster:start`.

## `cluster:destroy`
The "Cluster Wipe." Completely removes the local Kubernetes cluster, including all data, projects, and images.
- **Destructive**: Everything in the cluster — every project's PVCs, secrets, configmaps — is permanently deleted.
- **Confirmation**: Requires explicit confirmation.
- **Recovery**: Run `cluster:setup` (or just `up`) afterward to start fresh.
