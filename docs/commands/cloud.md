---
sidebar_position: 6
title: Cloud Deployment
description: Provision VPS infrastructure and deploy to remote Kubernetes clusters with LaraKube's cloud:* commands.
---
# Cloud Deployment

The `cloud:*` namespace covers the journey from local development to a production-grade VPS. These commands graduate your project from `.dev.test` to a real domain on a real cluster.

:::tip Pairs with the deployment guides
For the full graduation story, see [The Scaling Journey](../deployment/scaling-journey), the [$6/mo Baseline](../deployment/6dollar-baseline), and [GitHub Actions](../deployment/github-actions) for CI/CD wiring.
:::

## `cloud:provision`
The "VPS Bootstrap." Secures and prepares a fresh VPS for LaraKube. Installs K3s (Single-Node), hardens the firewall, configures the deploy user, and sets up the LaraKube Local CA.
- **Target**: A bare Ubuntu/Debian VPS (DigitalOcean droplet, Hetzner CX11, Vultr, etc.).
- **Result**: A cluster-ready box that `cloud:configure` and `cloud:deploy` can target.
- **One-time per VPS**: Run once when you stand up a new server.

## `cloud:configure`
The "Pipeline Setup." Configures the server and deployment pipeline for a specific project on a provisioned VPS.
- **What it sets up**: GHCR registry credentials, the namespace for your project, the production-shape Kubernetes manifests, environment-specific secrets and configmaps.
- **Per-project**: Run once per project per environment (e.g., `production`, `staging`).

## `cloud:deploy {environment}`
The "Release" button for remote environments. Builds and deploys your application to a remote cluster.
- **CI/CD Integration**: Designed to work seamlessly with GitHub Actions (see [GitHub Actions](../deployment/github-actions)).
- **Environment Targeting**: Specify the target environment as an argument (e.g., `larakube cloud:deploy production`).
- **Zero-downtime rolls**: Uses Kubernetes' standard rolling update strategy.

## `cloud:nuke {environment}`
The "Remote Cleanup." Wipes all project resources from the remote cluster — namespace, PVCs, services, ingresses.
- **Destructive**: Everything the project deployed to the cluster is removed. The cluster itself stays up.
- **Use when**: Decommissioning a project or starting over after a major architectural change.
- **Confirmation**: Requires explicit confirmation.

## `cloud:provision:nfs`
The "Shared Folder" escape hatch for multi-node clusters. Installs an in-cluster NFS provisioner so an environment can opt in to **`ReadWriteMany` (RWX)** shared storage instead of the stateless default — see [Storage across the scaling journey](../architecture/shared-storage#-storage-across-the-scaling-journey).
- **What it installs**: a single NFS server (a block volume re-exported over NFS) plus a dynamic provisioner, exposed as the `larakube-nfs` StorageClass. After it's installed, set `"sharedStorage": true` on the environment and redeploy.
- **Flags**: `--context`, `--size=10Gi` (backing block volume), `--storage-class=` (block class for the backing volume; defaults to the cluster default, e.g. `do-block-storage`), `--retain` (keep the PV on PVC delete).
- **Idempotent**: the `larakube-nfs` StorageClass is the marker — a completed install is a no-op. *(If an install half-fails, delete the StorageClass before re-running.)*

:::warning Experimental — not for DOKS
The NFS server is a single pod (a **soft storage SPOF** — your app pods stay HA) and depends on the node's NFS mount path, which **does not work on DigitalOcean Kubernetes (DOKS)**: the mount hangs. Prefer externalizing state to object storage + Redis; reach for this only when an app needs a genuine shared cross-node folder.
:::
