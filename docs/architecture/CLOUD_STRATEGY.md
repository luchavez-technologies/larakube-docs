---
sidebar_position: 6
title: The Scaling Roadmap
description: Visualize the journey of a LaraKube user, from local development to a single VPS, and finally to a multi-node managed Kubernetes cluster.
---
# 🚀 The Scaling Roadmap

This document visualizes the journey of a LaraKube user, from local development on their laptop to a cost-effective single VPS, and finally to a high-availability, multi-node managed Kubernetes cluster.

The core principle is **"Same Blueprint, Different Scale."** The application code and the `.larakube.json` blueprint remain identical at every stage. Only the deployment `strategy` changes.

## The Visualized Journey

```mermaid
sequenceDiagram
    participant User
    participant Local as Local Dev (K3d)
    participant SingleVPS as "Single-Node Hero" (VPS)
    participant DOKS as "Multi-Node" (DO K8s)

    box rgb(240, 248, 255) Local Development
        participant User
        participant Local
    end
    User->>Local: larakube up
    Local-->>User: App running on *.dev.test

    box rgb(240, 255, 240) Phase 1: Single VPS
        participant SingleVPS
    end
    User->>SingleVPS: larakube cloud:provision
    SingleVPS-->>User: K3s installed, returns kubeconfig
    User->>SingleVPS: larakube cloud:configure
    User->>SingleVPS: git push (triggers server-side build)
    SingleVPS-->>User: App running on production domain

    box rgb(255, 240, 245) Phase 2: Scale to Managed K8s
        participant DOKS
    end
    User->>DOKS: larakube cloud:provision --ha
    DOKS-->>User: DO K8s cluster ready
    User->>DOKS: larakube cloud:configure --strategy=multi-node-ha
    User->>DOKS: git push (triggers GHA runner build)
    DOKS-->>User: App running with high availability

    Note over User,DOKS: Same App, Same Blueprint, Different Scale!
```

## Stage Explanations

### 1. Local Development
-   **Environment**: A local K3d cluster managed by the `larakube` CLI.
-   **Cost**: Free.
-   **Goal**: Achieve perfect production parity on your laptop for bug-free development.

### 2. Single-Node Hero
-   **Environment**: A single, cost-effective VPS (starting ~$4-12/mo) running K3s.
-   **Deployment**: Uses the ultra-fast **server-side build cache**. The GHA runner simply tells the server to `git pull` and build itself.
-   **Goal**: Launch a production-ready application with minimal cost, rivaling Docker Swarm setups in price but with the power of K8s.

### 3. Multi-Node High Availability
-   **Environment**: A managed Kubernetes service like DigitalOcean Kubernetes (DOKS).
-   **Deployment**: The deployment `strategy` is switched to `multi-node-ha`. The GHA runner now builds the image itself and triggers a rolling update on the managed cluster.
-   **Goal**: Scale the application to handle enterprise-level traffic with redundancy and zero-downtime deployments, without changing a single line of application code.
