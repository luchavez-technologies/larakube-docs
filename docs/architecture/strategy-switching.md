---
sidebar_position: 9
title: Strategy Switching
description: How to graduate your infrastructure from single-node VPS to high-availability multi-node managed Kubernetes.
---
# 🏗️ Strategy Switching

LaraKube's "Same Blueprint, Different Scale" philosophy means you never have to rewrite your application for growth. When you're ready to graduate your infrastructure, you simply update your strategy and let LaraKube handle the transition.

## Step-by-Step Graduation

### 1. Update the Blueprint
Open your project's `.larakube.json` and locate the `strategy` configuration block.

```json
{
  "strategy": {
    "type": "single-node" 
  }
}
```

Change the `type` to `multi-node-ha`:

```json
{
  "strategy": {
    "type": "multi-node-ha"
  }
}
```

### 2. Regenerate Infrastructure
Now that your blueprint reflects the new scale, tell LaraKube to generate the updated Kubernetes manifests:

```bash
larakube heal
```

### 3. Deploy
Commit your changes to version control and push to your main branch:

```bash
git add .
git commit -m "🚀 Graduate infrastructure to Multi-Node HA"
git push origin main
```

## What Happens During Strategy Switching?
When you switch from `single-node` to `multi-node-ha`:
- **Storage**: LaraKube automatically reconciles your PVCs (PersistentVolumeClaims), preparing the cluster to handle shared storage across nodes (RWO ➜ RWX).
- **Ingress**: Traefik shifts from HostPort-based ingress to a load-balanced configuration suitable for managed Kubernetes clusters (e.g., DOKS).
- **Redundancy**: LaraKube increases pod replica counts and configures pod anti-affinity to ensure services are distributed across your new nodes for true high availability.

*Your application remains completely untouched. You just graduated to enterprise scale.*
