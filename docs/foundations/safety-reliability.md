---
sidebar_position: 5
title: Safety & Reliability
description: Learn how LaraKube protects your infrastructure from accidental misconfigurations and remote deployment errors.
---
# 🛡️ Safety & Reliability

LaraKube is engineered with "Industrial-Strength" safety guards to ensure that your production infrastructure remains stable and secure.

## 🚨 The Context Guard
Accidentally deploying local development code to a production cluster is a nightmare. LaraKube prevents this via the **Context Guard** (`InteractsWithClusterContext`).

### How it works:
When you run an orchestration command (like `up` or `down`), LaraKube:
1.  **Inspects** the current Kubernetes context (e.g., `k3d-larakube`).
2.  **Analyzes** keywords to determine if the cluster is likely local (`minikube`, `docker-desktop`, `orbstack`, etc.).
3.  **Cross-References** with your intended environment.

### Safety Alerts:
-   **Local code ➜ Remote Cluster**: Blocks the deployment and issues a high-severity security alert. You must explicitly confirm with "Yes" to proceed.
-   **Production ➜ Local Cluster**: Issues a helpful reminder that you are deploying production manifests to your laptop.

---

## 💾 Storage Access Modes
LaraKube intelligently manages Kubernetes **PersistentVolumeClaims (PVCs)** based on your deployment strategy.

| Strategy | Access Mode | Behavior |
| :--- | :--- | :--- |
| **Single-Node** | `ReadWriteOnce` | Optimized for speed on a single VPS. Volumes are mounted to one node at a time. |
| **Multi-Node** | `ReadWriteMany` | Optimized for scaling. Shared storage is available across multiple nodes simultaneously (e.g., using NFS or Ceph). |

*LaraKube handles this logic automatically within your blueprints, ensuring your data is always accessible by the right pods.*

---

## 📦 Surgical Extraction (`--minify`)
When LaraKube configures your CI/CD pipeline, it follows the principle of **Least Privilege**.

Using the `--minify` flag during secret generation, the CLI surgically extracts **only** the certificate and token required for the specific target environment.
-   **No Leakage**: Your other cluster credentials (e.g., your staging or local cluster keys) are never uploaded to GitHub.
-   **Clean Config**: The resulting secret is a standalone, valid Kubeconfig file with zero external dependencies.

---

## 🔄 Self-Healing DNA
The LaraKube CLI treats your `.larakube.json` as the **Source of Truth**.

If your Kubernetes manifests are ever accidentally modified or corrupted, you can run the `heal` command:

```bash
larakube heal
```

This command **regenerates** your entire infrastructure based on your project's DNA, restoring your cluster to a known-good state in seconds.

### Hand-Edit Safety & Locking
Edit the blueprint, not the manifest! The engine uses cryptographic signatures to track generated files. If you hand-edit a generated manifest in `.infrastructure/k8s/`, the `heal` command will detect the divergence, warn you, and **preserve your manual changes**.

If you intend to take over a manifest permanently, you can add it to the `locked_manifests` array in your `.larakube.json`. LaraKube will skip that file during future regenerations, ensuring your hand-crafted logic is completely safe from being overwritten.
