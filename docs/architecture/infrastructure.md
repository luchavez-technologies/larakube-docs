---
sidebar_position: 2
---
# Kubernetes Strategy

LaraKube uses a "Pure YAML" strategy. We avoid complex templating engines like Helm in favor of **Kustomize**, which is built directly into `kubectl`.

## 🏗 Kustomize Layers
Your infrastructure is split into two layers:
- **Base:** The "blueprint" of your app. This contains standard resources (Deployments, Services, PVCs) that stay the same across all environments.
- **Overlays:** Environment-specific overrides.
    - **Local Overlay:** Configures `hostPath` volumes for live-mounting your code and disables strict security for development.
    - **Production Overlay:** Enables cloud-native features and uses standard PersistentVolumeClaims for real disks.

## 📁 Namespace Management
LaraKube isolates projects using a strict naming convention: `{app-name}-{environment}`.
- **Example:** `my-app-local` and `my-app-production`.
- **Conflict Free:** This allows you to run multiple projects on a single cluster without worrying about service names colliding.

## 🔐 "Zero-Secrets-in-Git" Policy
LaraKube ensures that your sensitive cluster configuration never touches your Git repository.
- **Dynamic Generation:** The `ConfigMap` and `Secret` resources are generated **on-the-fly** during `larakube up` or `deploy`.
- **Source of Truth:** Your local, git-ignored `.env` files are the only source of truth.
- **Cluster Parity:** During project initialization, LaraKube automatically uncomments and configures your `.env` files to match the Kubernetes service names (e.g., `DB_HOST=postgres`).
