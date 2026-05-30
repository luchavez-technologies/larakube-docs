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
