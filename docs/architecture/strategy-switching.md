---
sidebar_position: 9
title: Strategy Switching
description: How to graduate your infrastructure from single-node VPS to high-availability multi-node managed Kubernetes.
---
# 🏗️ Strategy Switching

LaraKube CLI's "Same Blueprint, Different Scale" philosophy means you never have to rewrite your application for growth. When you're ready to graduate your infrastructure, you simply update your strategy and let LaraKube CLI handle the transition.

## Step-by-Step Graduation

### 1. Update the Blueprint
Usually, you don't even need to edit the blueprint manually. When you run `larakube cloud:configure` to record a multi-node managed cluster (like DOKS or EKS), LaraKube CLI automatically detects the cluster's node count and switches your strategy to `multi-node-ha` for you.

If you ever need to set it manually, open your project's `.larakube.json` and locate the `strategy` configuration block for your environment (or the global root).

```json
{
  "strategy": "single-node" 
}
```

Change it to `multi-node-ha`:

```json
{
  "strategy": "multi-node-ha"
}
```

### 2. Externalize State
Because multi-node app pods run **stateless** (they spread freely across nodes using ephemeral storage), you must externalize state so users don't lose sessions or uploads when their traffic hits a different pod.

Run the externalization command for your environment:

```bash
larakube cloud:externalize production
```

This command automatically flips your `.env` drivers (`FILESYSTEM_DISK`, `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION`) to use Redis and S3/Spaces, preparing your application for horizontal scale.

### 3. Regenerate Infrastructure
Now that your blueprint reflects the new scale, tell LaraKube CLI to generate the updated Kubernetes manifests:

```bash
larakube heal
```

### 4. Deploy
Commit your changes to version control and push to your main branch:

```bash
git add .
git commit -m "🚀 Graduate infrastructure to Multi-Node HA"
git push origin main
```

## What Happens During Strategy Switching?
When you switch from `single-node` to `multi-node-ha`:
- **Stateless Pods**: Your app pods (`web`, `horizon`, `ssr`) drop their persistent storage and use lightweight, ephemeral `emptyDir` volumes, allowing Kubernetes to instantly replicate them across many nodes.
- **Ingress**: Traefik shifts from a HostPort-based ingress to a Cloud LoadBalancer configuration suitable for managed Kubernetes clusters (e.g., DOKS).
- **Redundancy**: LaraKube CLI increases pod replica counts and configures pod anti-affinity to ensure services are strictly distributed across your new nodes for true high availability.

*(Note: If you have a legacy application that strictly requires a shared filesystem across multiple nodes, you can still opt into it by setting `"sharedStorage": true` in your environment blueprint and running `larakube cloud:init:nfs` on the cluster. However, externalizing to S3 is strongly recommended.)*

*Your application remains completely untouched. You just graduated to enterprise scale.*
