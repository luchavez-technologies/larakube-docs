---
sidebar_position: 2
title: Kubernetes Strategy
description: Explore LaraKube CLI's "Pure YAML" strategy using Kustomize layers, namespace isolation, and a Zero-Secrets-in-Git policy for Laravel orchestration.
---
# Kubernetes Strategy

LaraKube CLI uses a "Pure YAML" strategy. We avoid complex templating engines like Helm in favor of **Kustomize**, which is built directly into `kubectl`.

## 🏗 Kustomize Layers
Your infrastructure is split into two layers:
- **Base:** The "blueprint" of your app. This contains standard resources (Deployments, Services, PVCs) that stay the same across all environments. LaraKube CLI uses a **Shared Storage** model where all application pods share a single PVC for true workload parity. [Read more about Shared Storage here](./shared-storage.md).
- **Overlays:** Environment-specific overrides.
    - **Local Overlay:** Configures `hostPath` volumes for live-mounting your code, patches PVCs to `ReadWriteOnce` for local disk compatibility, and disables strict security for development.
    - **Production Overlay:** Enables cloud-native features and uses standard PersistentVolumeClaims for real disks.

## 📁 Namespace Management
LaraKube CLI isolates projects using a strict naming convention: `{app-name}-{environment}`.
- **Example:** `my-app-local` and `my-app-production`.
- **Conflict Free:** This allows you to run multiple projects on a single cluster without worrying about service names colliding.

## 🔐 "Zero-Secrets-in-Git" Policy
LaraKube CLI ensures that your sensitive cluster configuration never touches your Git repository.
- **Dynamic Generation:** The `ConfigMap` and `Secret` resources are generated **on-the-fly** during `larakube up` or `deploy`.
- **Source of Truth:** Your local, git-ignored `.env` files are the only source of truth.
- **Cluster Parity:** During project initialization, LaraKube CLI automatically uncomments and configures your `.env` files to match the Kubernetes service names (e.g., `DB_HOST=postgres`).
